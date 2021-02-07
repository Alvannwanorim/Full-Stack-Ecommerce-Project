import express from "express";
import { removeImage, upload } from "../controllers/cloudinary.js";
import { adminUser, auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/uploadimages", auth, adminUser, upload);
router.post("/removeimage", auth, adminUser, removeImage);

export default router;
