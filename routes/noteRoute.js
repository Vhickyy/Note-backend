import { Router } from "express";
import { getAllNotes, addNote, getSingleNote, updateNote, deleteNote, updateNoteDelete, updateNoteRetrieve, getAllDeletedNotes, clearAllDeletedNotes } from "../controllers/noteContoller.js";
import { addNoteValidation } from "../middlewares/validationMiddleware.js";

const router = Router();
router.route("/notes").get(getAllNotes).post(addNoteValidation,addNote);
router.route("/notes/:id").get(getSingleNote).patch(updateNote).delete(deleteNote);
router.patch("/notes/delete/:id",updateNoteDelete)
router.patch("/notes/retrieve/:id",updateNoteRetrieve)
router.get("/deleted-notes",getAllDeletedNotes)
router.delete("/clear-notes",clearAllDeletedNotes)

export default router;