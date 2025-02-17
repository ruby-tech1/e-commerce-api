const Review = require("../models/Review");
const Product = require("../models/Products");
const { checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product with id:${productId} was found`
    );
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already Submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  }); // for get info on refrenced ID in MongoDb

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review with id ${reviewId} was found`
    );
  }

  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review with id ${reviewId} was found`
    );
  }
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review with id ${reviewId} was found`
    );
  }

  checkPermissions(req.user, review.user);
  await review.deleteOne({ _id: reviewId });

  res.status(StatusCodes.OK).json({ msg: "success" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
