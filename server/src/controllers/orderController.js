import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res, next) {
  try {
    const { items, deliveryAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const requiredAddress = ["fullName", "phone", "addressLine", "city"];
    const missingAddress = requiredAddress.some((field) => !deliveryAddress?.[field]?.trim());

    if (missingAddress) {
      return res.status(400).json({ message: "Please complete the delivery address." });
    }

    const productIds = items.map((item) => item.productId);

    if (productIds.some((id) => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: "One or more cart items are invalid." });
    }

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    });

    const byId = new Map(products.map((p) => [p._id.toString(), p]));

    let totalAmount = 0;
    const orderItems = [];

    for (const rawItem of items) {
      const product = byId.get(rawItem.productId);
      const quantity = Math.max(1, Number(rawItem.quantity) || 1);

      if (!product) {
        return res.status(400).json({ message: "A product in your cart is no longer available." });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.productName}. Available: ${product.stock}`,
        });
      }

      orderItems.push({
        productId: product._id,
        vendorId: product.vendorId,
        productName: product.productName,
        quantity,
        unitPrice: product.price,
      });

      totalAmount += product.price * quantity;
    }

    // Interim implementation: update stock before creating the order.
    // For the final system, use MongoDB transactions where your deployment supports them.
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = await Order.create({
      customerId: req.user._id,
      items: orderItems,
      deliveryAddress: {
        fullName: deliveryAddress.fullName.trim(),
        phone: deliveryAddress.phone.trim(),
        addressLine: deliveryAddress.addressLine.trim(),
        city: deliveryAddress.city.trim(),
      },
      totalAmount: Number(totalAmount.toFixed(2)),
    });

    res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
}
