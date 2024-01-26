import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema({
    title: String,
    projectBody: Object,
    brief: {
        type: String
    },
    isFav: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    members:{
        type: [mongoose.Types.ObjectId],
        ref: "User"
    },
    dueDate:{
        type: Date
    }
},{
    timestamps: true
});

export default mongoose.model("Project", ProjectSchema)