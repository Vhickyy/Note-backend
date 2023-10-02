import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema({
    title: String,
    noteBody: String,
    category: String,
    isFav: Boolean,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
});

export default mongoose.model("Note", NoteSchema)