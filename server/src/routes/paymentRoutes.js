import { Router } from "express";
import {
  initiatePayment,
  confirmPayment,
  getPaymentByOrder,
  getPaymentHistory,
  getInvoice,
} from "../controllers/paymentController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.post("/initiate", protect, authorize("customer"), initiatePayment);
router.post("/confirm", protect, authorize("customer"), confirmPayment);
router.get("/history", protect, authorize("customer"), getPaymentHistory);
router.get("/order/:orderId", protect, authorize("customer"), getPaymentByOrder);
router.get("/:paymentId/invoice", protect, authorize("customer"), getInvoice);

export default router;