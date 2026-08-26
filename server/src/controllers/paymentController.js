import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import * as stripeService from "../services/stripeService.js";

/**
 * NOTE: order.totalAmount matches the field name in Sewwandi's Order model.
 */

export async function initiatePayment(req, res) {
  try {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "orderId and paymentMethod are required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const amount = order.totalAmount || 0;

    if (paymentMethod === "cash_on_delivery") {
      const payment = await Payment.create({
        order: order._id,
        user: req.user._id,
        amount,
        paymentMethod,
        status: "success",
        transactionId: stripeService.generateTransactionId(),
        invoiceNumber: stripeService.generateInvoiceNumber(),
        paidAt: new Date(),
      });

      order.paymentStatus = "paid";
      order.paymentMethod = "cash_on_delivery";
      await order.save();

      return res.status(201).json({ success: true, payment });
    }

    // card payment - create a mock Stripe payment intent
    const intent = await stripeService.createPaymentIntent({ amount });

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount,
      paymentMethod: "card",
      stripePaymentIntentId: intent.id,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      payment,
      clientSecret: intent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function confirmPayment(req, res) {
  try {
    const { paymentId, cardNumber } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.paymentMethod !== "card") {
      return res.status(400).json({
        success: false,
        message: "Only card payments require confirmation",
      });
    }

    const result = await stripeService.confirmPaymentIntent({
      paymentIntentId: payment.stripePaymentIntentId,
      cardNumber,
    });

    if (result.status === "succeeded") {
      payment.status = "success";
      payment.transactionId = stripeService.generateTransactionId();
      payment.invoiceNumber = stripeService.generateInvoiceNumber();
      payment.paidAt = new Date();
      await payment.save();

      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: "paid",
        paymentMethod: "card",
      });

      return res.json({ success: true, payment });
    }

    payment.status = "failed";
    payment.failureReason = result.error?.message || "Payment failed";
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, { paymentStatus: "failed" });

    return res.status(400).json({
      success: false,
      message: payment.failureReason,
      payment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPaymentByOrder(req, res) {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPaymentHistory(req, res) {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("order")
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getInvoice(req, res) {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate("order");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Invoice is only available for successful payments",
      });
    }

    return res.json({
      success: true,
      invoice: {
        invoiceNumber: payment.invoiceNumber,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        order: payment.order,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}