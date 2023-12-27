import Project from "../models/projectModel.js"
import mongoose from "mongoose"

export const addProject = async (req,res) => {
    const {title,brief,projectBody} = req.body;
    const newProject = {title,brief,projectBody,owner:req.user.userId,members:[req.user.userId]};
    const savedProject = await Project.create(newProject)
    res.status(201).json({msg:"successful",savedProject})
}

export const getAllProjects = async (req,res) => {
    const projects = await Project.find({members:{$in:[req.user.userId]}});
    res.status(200).json({msg:"successful",projects});
}
// owner:req.user.userId

export const getSingleProject = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(400);
        throw new Error(`Invalid id - ${id}`)
    }
    const project = await Project.findOne({_id:id,members:{$in:[req.user.userId]}});
    if(!project){
        res.status(400);
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const updateProject = async (req,res) => {
    const {id} = req.params;
    const {title,brief} = req.body;
    if(!title || !brief){
        res.status(400);
        throw new Error("title and project brief is required.")
    }
    const project = await Project.findOneAndUpdate({_id:id,owner:req.user.userId},{title,body},{new:true});
    if(!project){
        res.status(400)
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const deleteProject = async (req,res) => {
    const {id} = req.params;
    const project = await Project.findOneAndDelete({_id:id,owner:req.user.userId});
    if(!project){
        res.status(400)
        throw new Error(`No project with id ${id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const updateForAddUser = async (req,res) => {
    const {id} = req.params;
    const user = req.body.user;
    const project = await Project.findOne({_id:id,owner:req.user.userId});
    if(!project){
        res.status(400)
        throw new Error(`No note with id ${id}`)
    }
    console.log(user);
    const userInProject = project.members.find(member=>member.toString() === user.toString())
    if(userInProject){
        return res.status(200).json({msg:"User already a part of this project"})
    }
    const newMembers = [...project.members,user];
    console.log(newMembers);
    project.members = newMembers;
    await project.save();
    return res.status(200).json({msg:"successful",project})
}

export const updateForDeleteUser = async (req,res) => {
    const {id} = req.params;
    const deleteMemberId = req.body;
    const project = await Project.findOne({_id:id,owner:req.user.userId});
    if(!project){
        res.status(400)
        throw new Error(`No note with id ${id}`)
    }
    project.members = project.members.filter(member=> member.toString() !== deleteMemberId);
    await project.save();
    return res.status(200).json({msg:"successful",project})
}