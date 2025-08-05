import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running at localhost:${PORT}`);
});

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
}));

// DATABASE -----------------------------------------------------------------------------------
import Board from './models/Board.js'; 
import User from './models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL)
    .then(()=>{
        console.log('Connected to Mongoose Database');
    })
    .catch(err => console.log(`Can't connect to Mongoose DB. \n Error: ${err}`))


// GET board data
app.get(`/kanban/:id`, async (req, res) => {
    const id = req.params.id;

    try{
        const board = await Board.findById(id);
        res.json({success: true, board:board});
    }catch(error){
        console.error(`Can't find user with ID: ${id} \n Error: ${error}`);
    }
})


// PUT / Update the board
app.put(`/update-board/:id`, async (req, res) => {
    const id = req.params.id;
    const newBoard= req.body;

    try{
        const updated = await Board.findByIdAndUpdate(id, newBoard, {new:true, upsert:false});
        if(!updated){
            return res.status(404).json({ success: false, message: 'Board not found' });
        }
        
        res.status(201).json({ success: true, board: updated });
    }catch(error){
        console.error(`Error updating board ${id}:`, error);
        res.status(404).json({ success: false, board: updated });
    }
})





const SECRET_KEY = process.env.SECRET_KEY
app.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;

        const user = await User.findOne({
            $or: [{username},{password}]
        });

        if(!user){
            return res.status(401).json({success: false, message:'User does not exsits'})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({success: false, message:'Incorrect password or email|username'})
        }

        //create the JWToken
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email
        }, SECRET_KEY, { expiresIn: '1d' })

        res.status(200).json({
            success: true,
            message: 'Login succesfull',
            token,
            user:{
                userId: user._id,
                username: user.username,
                email: user.email
            }
        })

    }catch(error){
        console.log('Login unsuccessfull')
        res.status(404).json({ success: false, message: 'Internal server error' });
    }
})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //[Bearer, Token]

    if(!token){
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) {
            return res.status(401).json({ message: 'Access token required' });
        }
        req.user = user;
        next();
    })
}

// Token Verification
app.get('/verify-token', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user.userId,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// Create account
app.post(`/sign-up`, async (req, res) => {
    const account = req.body;

    try{
        const existingUser = await User.findOne({
            $or: [{username:account.username}, {email:account.email}],
        })

        if (existingUser){
            return res.status(400).json({success:false, message: "Username or Email already exists"});
        }else{
            const salt = 10;
            const hashedPassword = await bcrypt.hash(account.password, salt)

            const newUser = new User({
                username: account.username,
                email: account.email,
                password: hashedPassword
            })

            await newUser.save();
            return res.status(201).json({success: true, message: "User Created Succesfully"})

        }
    }catch(error){
        console.log(`Failed to add user: ${username} - ${email}`)
    }
})

// GET user boards
app.post(`/kanban/boards`, authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    const user = await User.findById(userId)
        .populate('personal_board')
        .populate('shared_board')

    res.json(({
        personal_board: user.personal_board,
        shared_board: user.shared_board
    }))

})

app.post('/kanban/create', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const boardData = req.body;
    const objectId = new mongoose.Types.ObjectId(userId)
    console.log('Creating board for user ' + userId)

    try{
        const newBoard = new Board({
            owner: objectId,
            title: boardData.title,
            desc: boardData.desc,
        })

        await User.updateOne(
            {_id: userId},
                {
                    $push: {
                        personal_board: newBoard._id
                    }
                }
        )

        await newBoard.save();
        return res.status(202).json({success: true, message: 'Succesfully created board'})
    }catch(error){
        console.log('Error creating board')
        console.log(error)
        return res.status(202).json({success: false, message: 'Failed creating board'})
    }
})

app.delete('/kanban/delete/:id', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.id;
    console.log('Removing Board: '+boardId+' from User: ' + userId)

    try{
        const board = await Board.findById(boardId)
        console.log('Found board:', board);

        if(!board){
            console.log('Board does not exists')
            return res.status(401).json({success: false, message:'Board does not exists'})
        }

        if(board.owner.toString() === userId){
            console.log('User is owner - deleting entire board');

            await Promise.all([
                // Remove board Id in owner
                User.findByIdAndUpdate(
                    board.owner,
                    { $pull: { personal_board: boardId } }
                ),

                // Remove board Id for all shared users
                User.updateMany(
                    { _id: { $in: board.shared_user } },
                    { $pull: { shared_board: boardId } }
                ),

                // Delete board
                Board.findByIdAndDelete(boardId)
            ]);

            return res.status(201).json({success: true, message:'Succesfully deleted shared board'})
        }else{
            // Non-owner, remove board is from shared_board
            await User.findByIdAndUpdate(
                userId,
                    { $pull: {shared_board: boardId } }
            )

            await Board.findByIdAndUpdate(
                boardId,
                {$pull: {shared_user: userId}}
            )

            return res.status(201).json({success: true, message:'Succesfully removed shared board'})
        }
    }catch(error){
        console.log('ERROR: ' + error)
        return res.status(401).json({success: false, message:'Connection Error'})
    }
})

app.post('/kanban/rename/:id', async (req, res) => {
    const boardId = req.params.id;
    const {newTitle, newDesc} = req.body;
    console.log(newTitle, newDesc)
    
    try{
        const board = await Board.findById(boardId);

        if(!board){
            console.log('Board does not exists')
            return res.status(401).json({success: false, message:'Board does not exists'})
        }

        await Board.findByIdAndUpdate(
            boardId,
            {
                title: newTitle.trim(),
                desc: newDesc.trim(),
            },
            {new: true}
        )

        return res.status(201).json({success: true, message:`Succesfully updated board: ${boardId}`})
    }catch(error){
        console.log('ERROR: ' + error)
        return res.status(401).json({success: false, message:'Connection Error'})
    }
})

app.get('/search/user', async (req, res) => {
    const { username } = req.query;

    const users = await User.find({
        username: {$regex: `^${username}`, $options: 'i'}
    })
    .select('_id username')
    .limit(10)

    return res.status(201).json({list:users})
})
