import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import productRouter from "./services/products/index.js"
import reviewRouter from "./services/reviews/index.js"
import categoryRouter from "./services/categories/index.js"
import shoppingcartRouter from "./services/shoppingCart/index.js"
import { notFoundHandler, badRequestHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express()

const port = process.env.PORT || 3001

// ************************* MIDDLEWARES ********************************

server.use(cors())
server.use(express.json())

// ************************* ROUTES ************************************

server.use("/products", productRouter)
server.use("/reviews", reviewRouter)
server.use("/category", categoryRouter)
server.use("/shoppingcart", shoppingcartRouter)

// ************************** ERROR HANDLERS ***************************

server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Successfully connected to Mongo!")
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`Server running on port ${port}`)
    })
})

mongoose.connection.on("error", err => {
    console.log(err)
})