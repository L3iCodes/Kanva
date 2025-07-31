import mongoose from "mongoose";

const ChecklistSchema = new mongoose.Schema({
    sub_task: String,
    done: {type: Boolean, default:false}
});

const TaskSchema = new mongoose.Schema({
    task_name: String,
    checklist: [ChecklistSchema]
});

const SectionSchema = new mongoose.Schema({
    name: String,
    tasks: [TaskSchema]
});

const BoardSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    title: String,
    desc: String,
    sections: [SectionSchema]
}, {timestamps:true});

export default mongoose.models.Board || mongoose.model('board', BoardSchema);

