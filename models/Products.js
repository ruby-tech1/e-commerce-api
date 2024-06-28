const mongoose = require("mongoose");
const Review = require("./Review");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: "true",
      required: [true, "Please provide product name"],
      maxlength: [100, "Name cannot be more than 100 charcters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide the product decription"],
      maxlength: [1000, "Description cannot be more than 100 charcters"],
    },
    image: {
      type: String,
      default: "/upload/example.jpeg",
    },
    category: {
      type: String,
      enum: ["office", "kitchen", "bedroom"],
      required: [true, "Please provide the product category"],
    },
    company: {
      type: String,
      required: [true, "Please provide the product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      required: [true, "Please provide the product colors"],
      default: ["#222"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "Please provide product invetory"],
      default: 15,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user for the product"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    // const id = this.getFilter()["_id"];
    // await Review.deleteMany({ product: id });
    await this.model("Review").deleteMany({ product: this.id });
  }
);

module.exports = mongoose.model("Product", ProductSchema);
