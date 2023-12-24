import mongoose from "mongoose";
import Note from "../models/noteModel.js"

const getAllNotes = async (req,res) => {
    const notes = await Note.find({userId:req.user.userId,isDeleted:false});
    res.status(200).json({msg:"successful",notes});
}

const getAllFavNotes = async (req,res) => {
    const notes = await Note.find({userId:req.user.userId,isFav:true});
    res.status(200).json({msg:"successful",notes});
}

// const addFav = async (req,res) => {}

const addNote = async (req,res) => {
    const {title,noteBody,category} = req.body;
    const newNote = {title,noteBody,category,userId:req.user.userId};
    const savedNote = await Note.create(newNote);
    res.status(201).json({msg:"successful",savedNote})
}

const getSingleNote = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(400);
        throw new Error(`Invalid id - ${id}`);
    }
    const note = await Note.findOne({_id:id,userId:req.user.userId});
    if(!note){
        res.status(400);
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",note})
}

const updateNote = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(400);
        throw new Error(`Invalid id - ${id}`)
    }
    const {noteBody, title, category, isFav} = req.body;
    if(!noteBody || !title){
        res.status(400);
        throw new Error("Note must have a title and body");
    }
    const updatedNote = {noteBody, title, category, isFav};
    const note = await Note.findOneAndUpdate({_id:id,userId:req.user.userId},updatedNote,{new:true});
    if(!note){
        res.status(400)
        throw new Error(`No note with id ${id}`);
    }
    res.status(200).json({msg:"successful",note});
}

const updateNoteDelete = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(400);
        throw new Error(`Invalid id - ${id}`)
    }
    const updatedNote = {isDeleted:true}
    const note = await Note.findOneAndUpdate({_id:id,userId:req.user.userId},updatedNote,{new:true});
    console.log(note);
    if(!note){
        res.status(400)
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",note})
}

const updateNoteRetrieve = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(400);
        throw new Error(`Invalid id - ${id}`)
    }
    const updatedNote = {isDeleted:false}
    const note = await Note.findOneAndUpdate({_id:id,userId:req.user.userId},updatedNote,{new:true});
    if(!note){
        res.status(400);
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",note})
}

const deleteNote = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(400);
        throw new Error(`Invalid id - ${id}`)
    }
    const note = await Note.findOneAndDelete({_id:id,userId:req.user.userId});
    if(!note){
        res.status(400)
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",note})
}

const getAllDeletedNotes = async (req,res) => {
    const notes = await Note.find({userId:req.user.userId,isDeleted:true});
    res.status(200).json({msg:"successful",notes});
}

const clearAllDeletedNotes = async (req,res) => {
    const notes = await Note.deleteMany({userId:req.user.userId,isDeleted:true});
    console.log(notes);
    res.status(200).json({msg:"successful"});
}

export {getAllNotes, addNote, getSingleNote, updateNote, deleteNote, getAllFavNotes,updateNoteDelete,updateNoteRetrieve,getAllDeletedNotes,clearAllDeletedNotes};