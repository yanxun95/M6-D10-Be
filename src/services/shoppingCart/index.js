import express from "express"
import createHttpError from "http-errors"
import ShoppingCartModel from "./schema.js"
import mongoose from "mongoose"

const shoppingcartRouter = express.Router()

shoppingcartRouter.post("/", async (req, res, next) => {
    try {
        const newShoopingCart = new ShoppingCartModel(req.body)
        const { _id } = await newShoopingCart.save()
        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

shoppingcartRouter.get("/:shoppingcartId", async (req, res, next) => {
    try {
        const shoppingcartId = req.params.shoppingcartId

        const shoppingcart = await ShoppingCartModel.findById(shoppingcartId).populate('products')

        if (shoppingcart) {
            res.send(shoppingcart)
        } else {
            next(createHttpError(404, `Shopping cart with id ${shoppingcartId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

shoppingcartRouter.delete("/:shoppingcartId", async (req, res, next) => {
    try {
        const shoppingcartId = req.params.shoppingcartId

        const deletedShoppingcart = await ShoppingCartModel.findByIdAndDelete(shoppingcartId)

        if (deletedShoppingcart) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `Shopping cart with id ${shoppingcartId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default shoppingcartRouter