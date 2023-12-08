import { Router } from "express";
import { getAllNotes, addNote, getSingleNote, updateNote, deleteNote, updateNoteDelete, updateNoteRetrieve } from "../controllers/noteContoller.js";
import { addNoteValidation } from "../middlewares/validationMiddleware.js";

const router = Router();
router.route("/notes").get(getAllNotes).post(addNoteValidation,addNote);
router.route("/notes/:id").get(getSingleNote).patch(updateNote).delete(deleteNote);
router.patch("/notes/delete/:id",updateNoteDelete)
router.patch("/notes/retrieve/:id",updateNoteRetrieve)

export default router;