import express from  "express"
const router = express.Router()

import {
    login, signup, checkUserExists, updateProfile 
} from "../controllers/user.js"

import { auth } from "../middlewares/auth.js"

router.post("/checkUserExists", checkUserExists);
router.post("/login", login);
router.post("/signup", signup);


router.patch("/update-profile", auth, updateProfile);
// --- END ---

export default router;