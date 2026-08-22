import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

await connectDB();

await Promise.all([
  User.deleteMany({}),
  Product.deleteMany({}),
  Order.deleteMany({}),
]);

const vendorPassword = await bcrypt.hash("Vendor123!", 12);
const customerPassword = await bcrypt.hash("Customer123!", 12);

const vendor = await User.create({
  name: "MarketHub Demo Vendor",
  email: "vendor@markethub.lk",
  password: vendorPassword,
  role: "vendor",
  businessName: "Lanka Lifestyle Store",
});

await User.create({
  name: "MarketHub Demo Customer",
  email: "customer@markethub.lk",
  password: customerPassword,
  role: "customer",
});

await Product.insertMany([
  {
    vendorId: vendor._id,
    productName: "Wireless Headphones",
    description: "Comfortable over-ear wireless headphones suitable for study, work and everyday listening.",
    category: "Electronics",
    price: 8990,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    vendorId: vendor._id,
    productName: "Minimal Backpack",
    description: "A practical everyday backpack with a clean design and space for a laptop and daily essentials.",
    category: "Fashion",
    price: 5490,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
  },
  {
    vendorId: vendor._id,
    productName: "Smart Watch",
    description: "A modern smartwatch for notifications, activity tracking and daily convenience.",
    category: "Electronics",
    price: 12990,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    vendorId: vendor._id,
    productName: "Ceramic Coffee Mug",
    description: "A simple ceramic mug for coffee, tea and office use.",
    category: "Home",
    price: 1490,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80"
  },
  {
    vendorId: vendor._id,
    productName: "Desk Lamp",
    description: "Compact desk lamp designed for study and work spaces.",
    category: "Home",
    price: 3990,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    vendorId: vendor._id,
    productName: "Classic Sneakers",
    description: "Comfortable casual sneakers suitable for everyday wear.",
    category: "Fashion",
    price: 6990,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  }
]);

console.log("Seed completed.");
console.log("Vendor: vendor@markethub.lk / Vendor123!");
console.log("Customer: customer@markethub.lk / Customer123!");
process.exit(0);
