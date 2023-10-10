import Note from "../models/noteModel.js"
const getAllNotes = async (req,res) => {
    const notes = await Note.find({});
    res.status(200).json({msg:"successful",notes});
}
const addNote = async (req,res) => {
    const {title,noteBody,category} = req.body;
    const newNote = {title,noteBody,category};
    const savedNote = await Note.create(newNote)
    res.status(201).json({msg:"successful",savedNote})
}
const getSingleNote = async (req,res) => {
    const {id} = req.params;
    const note = await Note.find({_id:id});
    if(!note){
        res.status(401);
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",note})
}
const updateNote = async (req,res) => {
    const {id} = req.params;
    const {noteBody, title, category, isFav} = req.body;
    const updatedNote = {noteBody, title, category}
    const note = await Note.findOneAndUpdate({_id:id},updatedNote,{runValidators:true});
    if(!note){
        res.status(401)
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",note})
}
const deleteNote = async (req,res) => {
    const {id} = req.params;
    const note = await Note.findOneAndDelete({_id:id});
    if(!note){
        res.status(401)
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",note})
}
export {getAllNotes, addNote, getSingleNote, updateNote, deleteNote};