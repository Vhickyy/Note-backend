import mongoose from "mongoose";
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
    const {noteId} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(noteId);
    if(!validId){
        res.status(401);
        throw new Error(`Invalid id - ${noteId}`)
    }
    const note = await Note.find({_id:noteId});
    if(!note){
        res.status(401);
        throw new Error(`No note with id ${idnoteId}`)
    }
    res.status(200).json({msg:"successful",note})
}
const updateNote = async (req,res) => {
    const {noteId} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(noteId);
    if(!validId){
        res.status(401);
        throw new Error(`Invalid id - ${noteId}`)
    }
    const {noteBody, title, category, isFav} = req.body;
    const updatedNote = {noteBody, title, category}
    const note = await Note.findByIdAndUpdate({_id:noteId},updatedNote,{new:true});
    if(!note){
        res.status(401)
        throw new Error(`No note with id ${noteId}`)
    }
    res.status(200).json({msg:"successful",note})
}
const deleteNote = async (req,res) => {
    const {noteId} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(noteId);
    if(!validId){
        res.status(401);
        throw new Error(`Invalid id - ${noteId}`)
    }
    const note = await Note.findOneAndDelete({_id:noteId});
    if(!note){
        res.status(401)
        throw new Error(`No note with id ${noteId}`)
    }
    res.status(200).json({msg:"successful",note})
}
export {getAllNotes, addNote, getSingleNote, updateNote, deleteNote};