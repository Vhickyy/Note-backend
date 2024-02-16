import Project from "../models/projectModel.js"
import User from "../models/userModel.js"
import mongoose from "mongoose"

export const addProject = async (req,res) => {
    const {title,brief,dueDate} = req.body;
    const newProject = {title,brief,dueDate,owner:req.user.userId,members:[req.user.userId]};
    const savedProject = await Project.create(newProject)
    res.status(201).json({msg:"successful",savedProject})
}

export const getAllProjects = async (req,res) => {
    const projects = await Project.find({members:{$in:[req.user.userId]}})
    res.status(200).json({msg:"successful",projects});
}

export const getSingleProject = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(400);
        throw new Error(`Invalid id - ${id}`)
    }
    const project = await Project.findOne({_id:id,members:{$in:[req.user.userId]}}).populate({
        path: "members",
        select: "name"
    });
    if(!project){
        res.status(400);
        throw new Error(`No note with id ${id}`)
    }
    console.log(project);
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
    const {email} = req.body;
    console.log(id,email);
    const memberExist = await User.findOne({email});
    if(!memberExist){
        console.log("hi1");
        res.status(400);
        throw new Error("No such user, check email provided")
    }
    const project = await Project.findOne({_id:id,owner:req.user.userId});
    
    if(!project){
        res.status(400)
        throw new Error(`No note with id ${id}`)
    }
    console.log("hi");
    const userInProject = project.members.find(member => member.toString() === memberExist._id.toString());
    console.log(userInProject);
    if(userInProject){
        console.log("ji");
        return res.status(400).json({msg:"User already a part of this project"})
    }
    const newMembers = [...project.members,memberExist._id];
    project.members = newMembers;
    await project.save()
    // const result = (await project.save()).populate({
    //     path: "members",
    //     select: "name"
    // });
    // const data = await result
    return res.status(200).json({msg:"successful",project})
}

export const updateForDeleteUser = async (req,res) => {
    const {id} = req.params;
    const {memberId} = req.body;
    console.log(memberId);
    const project = await Project.findOne({_id:id,owner:req.user.userId});
    if(!project){
        res.status(400)
        throw new Error(`No note with id ${id}`)
    }
    project.members = project.members.filter(member=> member.toString() !== memberId.toString());
    console.log(project.members);
    await project.save();
    // console.log(project);
    return res.status(200).json({msg:"successful"})
}