import express from "express"
import createHttpError from "http-errors"
import ReviewModel from "./schema.js"

const reviewRouter = express.Router()

reviewRouter.post("/", async (req, res, next) => {
    try {
        const newReview = new ReviewModel(req.body)
        const { _id } = await newReview.save()

        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

reviewRouter.get("/", async (req, res, next) => {
    try {
        const reviews = await ReviewModel.find()

        res.send(reviews)
    } catch (error) {
        next(error)
    }
})

reviewRouter.get("/:reviewId", async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId

        const review = await ReviewModel.findById(reviewId)

        if (review) {
            res.send(review)
        } else {
            next(createHttpError(404, `review with id ${reviewId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

reviewRouter.put("/:reviewId", async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId
        const modifiedreview = await ReviewModel.findByIdAndUpdate(reviewId, req.body, {
            new: true,
        })

        if (modifiedreview) {
            res.send(modifiedreview)
        } else {
            next(createHttpError(404, `blog with id ${reviewId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

reviewRouter.delete("/:reviewId", async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId

        const deletedreview = await ReviewModel.findByIdAndDelete(reviewId)

        if (deletedreview) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `review with id ${reviewId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

export default reviewRouter