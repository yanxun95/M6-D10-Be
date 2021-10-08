import express from "express"
import createHttpError from "http-errors"
import ReviewModel from "./schema.js"
import q2m from "query-to-mongo"

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
        const query = q2m(req.query)
        const reviews = await ReviewModel
        .find(query.criteria, query.options.fields)
        .limit(query.options.limit || 5)
        .skip(query.options.skip)
        .sort(query.options.sort)

        const totalReviews = await ReviewModel.countDocuments(query.criteria)
        const reviewsWithLinks = {
            links: query.links("/reviews", totalReviews), 
            totalReviews, 
            pageTotal: Math.ceil(totalReviews / query.options.limit), 
            reviews
        }
        res.send(reviewsWithLinks)
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