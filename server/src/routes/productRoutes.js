import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  listMyProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

// Public product listing.
router.get("/", listProducts);
router.get("/mine", protect, authorize("vendor", "admin"), listMyProducts);
router.get("/:id", getProduct);

router.post("/", protect, authorize("vendor", "admin"), createProduct);
router.put("/:id", protect, authorize("vendor", "admin"), updateProduct);
router.delete("/:id", protect, authorize("vendor", "admin"), deleteProduct);

export default router;
