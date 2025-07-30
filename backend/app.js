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

app.post('/kanban/create', async (req, res) => {
    console.log('Creating board')
    const boardData = req.body;

    try{
        const newBoard = new Board({
            owner: boardData.owner,
            title: boardData.title,
            desc: boardData.desc,
        })

        console.log(newBoard)

        await newBoard.save();
        return res.status(202).json({success: true, message: 'Succesfully created board'})
    }catch(error){
        console.log('Error creating board')
        console.log(error)
        return res.status(202).json({success: false, message: 'Failed creating board'})
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
