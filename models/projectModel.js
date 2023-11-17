import mongoose from "mongoose"

const ProjectSchema = new mongoose.Schema({
    title: String,
    noteBody: String,
    category: {
        type: String,
        default: "uncategorized"
    },
    isFav: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
    // group:{
    //     type: [mongoose.Types.ObjectId],
    //     ref: "User"
    // },
    // lastMessage:{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Message'
    // }
},{
    timestamps: true
});

export default mongoose.model("Project", ProjectSchema)