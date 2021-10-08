import express from "express"
import createHttpError from "http-errors"
import ReviewModel from "./schema.js"
import q2m from "query-to-mongo"

const reviewRouter = express.Router()

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

export default reviewRouter