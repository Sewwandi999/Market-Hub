import express from "express";
import {
  initiatePayment,
  confirmPayment,
  getPaymentByOrder,
  getPaymentHistory,
  getInvoice,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/initiate", protect, initiatePayment);
router.post("/confirm", protect, confirmPayment);
router.get("/history", protect, getPaymentHistory);
router.get("/order/:orderId", protect, getPaymentByOrder);
router.get("/:paymentId/invoice", protect, getInvoice);

export default router;