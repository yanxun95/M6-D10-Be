import express from "express"
import createHttpError from "http-errors"
import ProductModel from "./schema.js"
import ReviewModel from "../reviews/schema.js"
import mongoose from "mongoose"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import q2m from "query-to-mongo"

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
            res.send(product) 
        } else {
            next(createHttpError(404, `No product with id: ${req.params.productId}`))
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
        const query = q2m(req.query)
        const products = await ProductModel
        .find(query.criteria, query.options.fields)
        .limit(query.options.limit || 6)
        .skip(query.options.skip)
        .sort(query.options.sort)
        
        const totalProducts = await ProductModel.countDocuments(query.criteria)
        const resWithLinks = {
            links: query.links("/products", totalProducts), 
            totalProducts, 
            pageTotal: Math.ceil(totalProducts / query.options.limit), 
            products
        }
        res.send(resWithLinks)
        // console.log("*********", query)
        // console.log("*********", resWithLinks)

    } catch (error) {
        next(error)
    }
})




export default productRouter