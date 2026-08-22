import mongoose from "mongoose";
import Product from "../models/Product.js";

export async function listProducts(req, res, next) {
  try {
    const {
      search = "",
      category = "",
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      mine = "false",
    } = req.query;

    const filter = { isActive: true };

    if (search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== "") filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "") filter.price.$lte = Number(maxPrice);
    }

    if (mine === "true" && req.user) {
      filter.vendorId = req.user._id;
    }

    const numericPage = Math.max(1, Number(page) || 1);
    const numericLimit = Math.min(50, Math.max(1, Number(limit) || 12));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("vendorId", "name businessName")
        .sort({ createdAt: -1 })
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        pages: Math.ceil(total / numericLimit),
      },
    });
  } catch (error) {
    next(error);
  }
}


export async function listMyProducts(req, res, next) {
  try {
    const products = await Product.find({
      vendorId: req.user._id,
      isActive: true,
    })
      .populate("vendorId", "name businessName")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(req.params.id).populate(
      "vendorId",
      "name businessName"
    );

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { productName, description, category, price, stock, imageUrl } = req.body;

    if (!productName || !description || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ message: "Please complete all required product fields." });
    }

    const product = await Product.create({
      vendorId: req.user._id,
      productName: productName.trim(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl?.trim() || undefined,
    });

    res.status(201).json({ message: "Product created.", product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const isOwner = product.vendorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only edit your own products." });
    }

    const allowed = ["productName", "description", "category", "price", "stock", "imageUrl", "isActive"];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        product[key] = ["price", "stock"].includes(key) ? Number(req.body[key]) : req.body[key];
      }
    }

    await product.save();
    res.json({ message: "Product updated.", product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const isOwner = product.vendorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own products." });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: "Product removed." });
  } catch (error) {
    next(error);
  }
}
