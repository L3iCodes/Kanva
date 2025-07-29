import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server is running at localhost:${PORT}`);
});

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
}));


import Board from './models/Board.js'; 

const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL)
    .then(()=>{
        console.log('Connected to Mongoose Database');
    })
    .catch(err => console.log(`Can't connect to Mongoose DB. \n Error: ${err}`))


app.get(`/kanban/:id`, async (req, res) => {
    const id = req.params.id;

    try{
        const board = await Board.findById(id);
        res.json({success: true, board:board});
    }catch(error){
        console.error(`Can't find user with ID: ${id} \n Error: ${error}`);
    }
})


app.put(`/update-board/:id`, async (req, res) => {
    const id = req.params.id;
    const newBoard= req.body;
    console.log('UPDATING')

    try{
        const updated = await Board.findByIdAndUpdate(id, newBoard, {new:true, upsert:false});
        if(!updated){
            return res.status(404).json({ success: false, message: 'Board not found' });
        }
        
        res.json({ success: true, board: updated });
    }catch(error){
        console.error(`Error updating board ${id}:`, error);
        res.json({ success: true, board: updated });
    }
})
