import Project from "../models/projectModel"

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
    const {Id} = req.params;
    const validId = mongoose.Types.ObjectId.isValid(Id);
    if(!validId){
        res.status(401);
        throw new Error(`Invalid id - ${Id}`)
    }
    const project = await Project.find({_id:Id,members:req.user.userId});
    if(!project){
        res.status(401);
        throw new Error(`No note with id ${Id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const updateProject = async (req,res) => {
    const {Id} = req.params;
    const {title,brief} = req.body;
    if(!title || !brief){
        res.status(400);
        throw new Error("title and projectb brief is required.")
    }
    const project = await Project.findOneAndUpdate({_id:Id,owner:req.user.userId},{title,body},{new:true});
    if(!project){
        res.status(401)
        throw new Error(`No note with id ${Id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const deleteProject = async (req,res) => {
    const {Id} = req.params;
    const project = await Note.findOneAndDelete({_id:Id,owner:req.user.userId});
    if(!project){
        res.status(401)
        throw new Error(`No project with id ${Id}`)
    }
    res.status(200).json({msg:"successful",project})
}

export const updateForAddUser = async (req,res) => {
    const {Id} = req.params;
    const members = req.body;
    const project = await Project.findOne({_id:Id,owner:req.user.userId});
    if(!project){
        res.status(401)
        throw new Error(`No note with id ${Id}`)
    }
    const newMembers = new Set([...project.members,...members]);
    project.members = newMembers;
    await project.save();
    return res.status(200).json({msg:"successful",project})
}

export const updateForDeleteUser = async (req,res) => {
    const {Id} = req.params;
    const deleteMemberId = req.body;
    const project = await Project.findOne({_id:Id,owner:req.user.userId});
    if(!project){
        res.status(401)
        throw new Error(`No note with id ${Id}`)
    }
    project.members = project.members.filter(member=> member.toString() !== deleteMemberId);
    await project.save();
    return res.status(200).json({msg:"successful",project})
}