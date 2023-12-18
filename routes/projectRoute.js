import { Router } from "express";
import { addProject, deleteProject, getAllProjects, getSingleProject, updateForAddUser, updateForDeleteUser, updateProject } from "../controllers/projectController.js";

const router = Router();
router.route("/projects").get(getAllProjects).post(addProject);
router.route("/projects/:id").get(getSingleProject).patch(updateProject).delete(deleteProject);
router.route("/project/add-user/:id",updateForAddUser)
router.route("/project/delete-user/:id",updateForDeleteUser)

export default router;