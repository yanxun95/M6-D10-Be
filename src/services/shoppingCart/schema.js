import mongoose from "mongoose"

const { Schema, model } = mongoose


const shoppingCartSchema = new Schema(
    {
        userId: { type: String, required: true },
        products: [{
            productId: { type: Schema.ObjectId, ref: "Product" },
            quantity: { type: Number, min: 1, max: 30, required: true }
        }],
    },
    { timestamps: true }
)

export default model("shoppingCart", shoppingCartSchema)