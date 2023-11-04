import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema({
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
    group:{
        type: [mongoose.Types.ObjectId],
        ref: "User"
    },
    lastMessage:{
        type: mongoose.Types.ObjectId,
        ref: 'Message'
    }
},{
    timestamps: true
});

export default mongoose.model("Note", NoteSchema)