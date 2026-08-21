import { Router } from "express";
import { createOrder, myOrders } from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, authorize("customer"), createOrder);
router.get("/my", protect, authorize("customer"), myOrders);

export default router;
