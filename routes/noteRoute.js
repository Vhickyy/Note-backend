import { Router } from "express";
import { getAllNotes, addNote, getSingleNote, updateNote, deleteNote } from "../controllers/noteContoller.js";
const router = Router();
router.route("/notes").get(getAllNotes).post(addNote);
router.route("/notes/:noteId").get(getSingleNote).patch(updateNote).delete(deleteNote);

export default router;