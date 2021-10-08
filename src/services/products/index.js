import express from "express"
import createHttpError from "http-errors"
import ProductModel from "./schema.js"
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

productRouter.post("/:productId/upload", multer({ storage: cloudStorage }).single("productImg"), async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            req.params.productId,
            { $set: { imageUrl: req.file.path } },
            { new: true }
        )
        if (product) {
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
        let product;
        if (typeof req.body.category === "undefined") {
            const newProduct = new ProductModel(req.body)
            product = await newProduct.save()
        } else {
            const newProduct = { ...req.body, category: req.body.category.map(cat => mongoose.Types.ObjectId(cat)) }
            const saveProduct = new ProductModel(newProduct)
            product = await saveProduct.save()
        }

        res.status(201).send(product._id)
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
        const productsWithLinks = {
            links: query.links("/products", totalProducts),
            totalProducts,
            pageTotal: Math.ceil(totalProducts / query.options.limit),
            products
        }
        res.send(productsWithLinks)

    } catch (error) {
        next(error)
    }
})

productRouter.get("/:productId", async (req, res, next) => {
    try {
        const productId = req.params.productId

        const product = await ProductModel.findById(productId).populate('category')

        if (product) {
            res.send(product)
        } else {
            next(createHttpError(404, `product with id ${productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

productRouter.put("/:productId", async (req, res, next) => {
    try {
        const productId = req.params.productId
        const modifiedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, {
            new: true,
        })

        if (modifiedProduct) {
            res.send(modifiedProduct)
        } else {
            next(createHttpError(404, `blog with id ${productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

productRouter.delete("/:productId", async (req, res, next) => {
    try {
        const productId = req.params.productId

        const deletedProduct = await ProductModel.findByIdAndDelete(productId)

        if (deletedProduct) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `product with id ${productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

productRouter.post("/:productId/category/", async (req, res, next) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.productId,
            { $push: { category: req.body.categories.map(cat => mongoose.Types.ObjectId(cat)) } },
            { new: true })
        if (updatedProduct) {
            res.send(updatedProduct)
        } else {
            next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default productRouter