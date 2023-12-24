import {Router} from "express";
import { getAllUser, getUser } from "../controllers/userController.js";

const router = Router();

router.get("/user",getUser);
router.get("/alluser",getAllUser);

export default router;