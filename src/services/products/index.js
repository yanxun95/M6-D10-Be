import express from "express"
import createHttpError from "http-errors"
import ProductModel from "./schema.js"
import ReviewModel from "../reviews/schema.js"
import mongoose from "mongoose"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const productRouter = express.Router()
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "products",
    },
})

productRouter.post("/:productId/upload", multer({storage: cloudStorage}).single("productImg"), async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            req.params.productId, 
            {$set: {imageUrl: req.file.path}},
            {new: true}
            )
        if(product){
            console.log(product, req.file)
            res.send(product) 
        }
    } catch (error) {
        next(error)
    }
})



productRouter.post("/", async (req, res, next) => {
    try {
        const newProduct = new ProductModel(req.body)
        const { _id } = await newProduct.save()

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

productRouter.get("/", async (req, res, next) => {
    try {
        const products = await ProductModel.find()

        res.send(products)
    } catch (error) {
        next(error)
    }
})




export default productRouter