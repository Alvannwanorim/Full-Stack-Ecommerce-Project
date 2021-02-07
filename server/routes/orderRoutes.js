import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderItemById,
  getOrders,
  updateOrdeToDelivered,
  updateOrdeToPaid,
} from "../controllers/orderController.js";
import { adminUser, auth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(auth, addOrderItems).get(auth, adminUser, getOrders);
router.route("/myorders").get(auth, getMyOrders);
router.route("/:id").get(auth, getOrderItemById);
router.route("/:id/pay").put(auth, updateOrdeToPaid);
router.route("/:id/deliver").put(auth, adminUser, updateOrdeToDelivered);
export default router;
