const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  confirmPayment,
  getPaymentByOrder,
  getPaymentHistory,
  getInvoice,
} = require("../controllers/paymentController");

// Adjust this import if Shani's middleware exports the function under a
// different name - check server/src/middleware/auth.js
const { protect } = require("../middleware/auth");

router.post("/initiate", protect, initiatePayment);
router.post("/confirm", protect, confirmPayment);
router.get("/history", protect, getPaymentHistory);
router.get("/order/:orderId", protect, getPaymentByOrder);
router.get("/:paymentId/invoice", protect, getInvoice);

module.exports = router;
