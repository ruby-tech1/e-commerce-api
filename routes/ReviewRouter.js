const express = require("express");
const router = express.Router();

const { AutheticateUser } = require("../middleware/authentication");
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");

router.route("/").post(AutheticateUser, createReview).get(getAllReviews);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(AutheticateUser, updateReview)
  .delete(AutheticateUser, deleteReview);

module.exports = router;
