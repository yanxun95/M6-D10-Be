import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);
productSchema.static("findReviews", async function (mongoQuery) {
  // this cannot be an arrow function
  // const total = await this.countDocuments(mongoQuery.criteria)
  const reviews = await this.find(
    mongoQuery.criteria,
    mongoQuery.options.fields
  )
    //   .limit(mongoQuery.options.limit || 10)
    //   .skip(mongoQuery.options.skip)
    //   .sort(mongoQuery.options.sort) // no matter how I write them but Mongo will always apply SORT then SKIP then LIMIT in this order
    .populate({ path: "reviews" }); // this is goin' to "join" authors with books by searching for all the references in the authors array (array of objectIds)

  return { total, books };
});
export default model("Product", productSchema);
