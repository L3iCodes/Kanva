import mongoose, { mongo } from "mongoose"

const RequestSchema = new mongoose.Schema({
    sender: String,
    receiver: mongoose.Schema.Types.ObjectId,
    type: String,
    boardId: mongoose.Schema.Types.ObjectId,
})

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    personal_board: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
     shared_board: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    messages: [RequestSchema]
})

export default mongoose.models.User || mongoose.model('users', UserSchema)