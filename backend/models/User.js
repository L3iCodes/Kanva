import mongoose from "mongoose"

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
})

export default mongoose.models.User || mongoose.model('users', UserSchema)