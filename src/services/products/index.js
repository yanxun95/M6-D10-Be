import express from "express";
import createHttpError from "http-errors";
import ProductModel from "./schema.js";
import ReviewModel from "../reviews/schema.js";
import mongoose from "mongoose";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductModel(req.body);
    const { _id } = await newProduct.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductModel.find();

    res.send(products);
  } catch (error) {
    next(error);
  }
});

export default productRouter;
