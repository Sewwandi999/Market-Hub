import { Router } from "express";
import {
  createReview,
  deleteReview,
  getProductReviews,
  updateReview,
} from "../controllers/reviewController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.get("/product/:productId", getProductReviews);

router.post(
  "/",
  protect,
  authorize("customer"),
  createReview
);

router.put(
  "/:id",
  protect,
  authorize("customer"),
  updateReview
);

router.delete(
  "/:id",
  protect,
  authorize("customer", "admin"),
  deleteReview
);

export default router;
