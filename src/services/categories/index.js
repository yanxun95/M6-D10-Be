import express from "express"
import createHttpError from "http-errors"
import CategoriesModel from "./schema.js"

const categoriesRouter = express.Router()

categoriesRouter.post("/", async (req, res, next) => {
    try {
        const newCategory = new CategoriesModel(req.body)
        const { _id } = await newCategory.save()

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

categoriesRouter.get("/", async (req, res, next) => {
    try {
        const categories = await CategoriesModel.find()

        res.send(categories)
    } catch (error) {
        next(error)
    }
})

categoriesRouter.get("/:categoryId", async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId

        const category = await CategoriesModel.findById(categoryId)

        if (category) {
            res.send(category)
        } else {
            next(createHttpError(404, `category with id ${categoryId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

categoriesRouter.put("/:categoryId", async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId
        const modifiedcategory = await CategoriesModel.findByIdAndUpdate(categoryId, req.body, {
            new: true,
        })

        if (modifiedcategory) {
            res.send(modifiedcategory)
        } else {
            next(createHttpError(404, `blog with id ${categoryId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

categoriesRouter.delete("/:categoryId", async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId

        const deletedcategory = await CategoriesModel.findByIdAndDelete(categoryId)

        if (deletedcategory) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `category with id ${categoryId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default categoriesRouter