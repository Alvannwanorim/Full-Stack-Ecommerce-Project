import express from "express";
import { auth, adminUser } from "../middleware/authMiddleware.js";
import {
  createProduct,
  createProductReviews,
  deletePorductById,
  getPorductById,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProducts).post(auth, adminUser, createProduct);
router.route("/:id/reviews").post(auth, createProductReviews);
router.get("/top", getTopProducts);
router
  .route("/:id")
  .get(getPorductById)
  .delete(auth, adminUser, deletePorductById)
  .put(auth, adminUser, updateProduct);

export default router;
