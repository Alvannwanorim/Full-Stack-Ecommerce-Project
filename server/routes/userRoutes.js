import express from "express";
import {
  authUser,
  deleteUser,
  getUser,
  getUserById,
  getUsers,
  registerUser,
  updateUserByAdmin,
  updateUserProfile,
} from "../controllers/userController.js";
import { auth, adminUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(auth, adminUser, getUsers);
router.post("/login", authUser);
router.route("/profile").get(auth, getUser).put(auth, updateUserProfile);
router.route("/register").post(registerUser);
router
  .route("/:id")
  .delete(auth, adminUser, deleteUser)
  .get(auth, adminUser, getUserById)
  .put(auth, adminUser, updateUserByAdmin);

export default router;
