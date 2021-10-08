import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./schema.js";
import ReviewModel from "../reviews/schema.js";
// import mongoose from "mongoose";

const productReviews = express.Router();
productReviews.post("/:postId/review", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await ProductModel.findById(postId);

    if (post) {
      const createComment = await ReviewModel.create(req.body);

      const review = { ...createComment.toObject() };
      const updatePost = await ProductModel.findByIdAndUpdate(
        req.params.postId,
        {
          $push: { reviews: review },
        }
      );

      res.send(updatePost);
    } else {
      next(createHttpError(404, `post with id ${postId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
productReviews.get("/:postId/review/:reviewId", async (req, res, next) => {
  try {
    const post = await ProductModel.findById(req.params.postId);
    if (post) {
      const findReview = post.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (findReview) {
        res.send(findReview);
      } else {
        res.status(401).send(`review with id ${req.params.reviewId} not found`);
      }
    }
  } catch (error) {
    next(error);
  }
});
export default productReviews;
