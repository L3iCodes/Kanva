import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    personal_board: [],
    shared_board: [],
})

export default mongoose.models.User || mongoose.model('users', UserSchema)