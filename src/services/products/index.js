import express from "express"
import createHttpError from "http-errors"
import ProductModel from "./schema.js"

const productRouter = express.Router()

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

productRouter.get("/:productId", async (req, res, next) => {
    try {
        const productId = req.params.productId

        const product = await ProductModel.findById(productId)

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

export default productRouter