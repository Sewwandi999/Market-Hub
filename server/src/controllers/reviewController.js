import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

export async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const productExists = await Product.exists({ _id: productId, isActive: true });

    if (!productExists) {
      return res.status(404).json({ message: "Product not found." });
    }

    const reviews = await Review.find({ productId })
      .populate("customerId", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(1)
          );

    res.json({
      reviews,
      summary: {
        averageRating,
        totalReviews,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const { productId, rating, comment } = req.body;

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    if (!comment?.trim()) {
      return res.status(400).json({ message: "Please enter a review comment." });
    }

    const product = await Product.findOne({ _id: productId, isActive: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const existingReview = await Review.findOne({
      customerId: req.user._id,
      productId,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this product. You can edit your existing review.",
      });
    }

    const review = await Review.create({
      customerId: req.user._id,
      productId,
      rating: numericRating,
      comment: comment.trim(),
    });

    await review.populate("customerId", "name");

    res.status(201).json({
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateReview(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid review id." });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own review." });
    }

    if (req.body.rating !== undefined) {
      const numericRating = Number(req.body.rating);

      if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
      }

      review.rating = numericRating;
    }

    if (req.body.comment !== undefined) {
      if (!req.body.comment?.trim()) {
        return res.status(400).json({ message: "Review comment cannot be empty." });
      }

      review.comment = req.body.comment.trim();
    }

    await review.save();
    await review.populate("customerId", "name");

    res.json({
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid review id." });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    const isOwner = review.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own review." });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    next(error);
  }
}
