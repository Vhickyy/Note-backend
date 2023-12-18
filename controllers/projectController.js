import Project from "../models/projectModel.js"

export const addProject = async (req,res) => {
    const {title,brief} = req.body;
    const newProject = {title,brief};
    const savedProject = await Note.create(newProject)
    res.status(201).json({msg:"successful",savedProject})
}

export const getAllProjects = async (req,res) => {
    const projects = await Project.find({members:req.user});
    res.status(200).json({msg:"successful",projects});
}

export const getSingleProject = async (req,res) => {
    const {id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId){
        res.status(401);
        throw new Error(`Invalid id - ${id}`)
    }
    const project = await Project.find({_id:id,members:req.user.userId});
    if(!project){
        res.status(401);
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const updateProject = async (req,res) => {
    const {id} = req.params;
    const {title,brief} = req.body;
    if(!title || !brief){
        res.status(400);
        throw new Error("title and projectb brief is required.")
    }
    const project = await Project.findOneAndUpdate({_id:id,owner:req.user.userId},{title,body},{new:true});
    if(!project){
        res.status(401)
        throw new Error(`No note with id ${id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const deleteProject = async (req,res) => {
    const {id} = req.params;
    const project = await Note.findOneAndDelete({_id:id,owner:req.user.userId});
    if(!project){
        res.status(401)
        throw new Error(`No project with id ${id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const updateForAddUser = async (req,res) => {
    const {id} = req.params;
    const members = req.body;
    const project = await Project.findOne({_id:id,owner:req.user.userId});
    if(!project){
        res.status(401)
        throw new Error(`No note with id ${id}`)
    }
    const newMembers = new Set([...project.members,...members]);
    project.members = newMembers;
    await project.save();
    return res.status(200).json({msg:"successful",project})
}

export const updateForDeleteUser = async (req,res) => {
    const {id} = req.params;
    const deleteMemberId = req.body;
    const project = await Project.findOne({_id:id,owner:req.user.userId});
    if(!project){
        res.status(401)
        throw new Error(`No note with id ${id}`)
    }
    project.members = project.members.filter(member=> member.toString() !== deleteMemberId);
    await project.save();
    return res.status(200).json({msg:"successful",project})
}