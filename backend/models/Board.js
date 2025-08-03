import mongoose from "mongoose";

const ChecklistSchema = new mongoose.Schema({
    sub_task: String,
    done: {type: Boolean, default:false}
});

const TaskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    task_name: String,
    checklist: [ChecklistSchema]
});

const SectionSchema = new mongoose.Schema({
    name: String,
    tasks: [TaskSchema]
});

const BoardSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: String,
    desc: String,
    shared_user: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    sections: [SectionSchema]
}, {timestamps:true});

export default mongoose.models.Board || mongoose.model('boards', BoardSchema);

