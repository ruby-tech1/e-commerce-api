const express = require("express");
const router = express.Router();

const { authorizePermissions } = require("../middleware/authentication");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/ProductController");

const { getSingleProductReviews } = require("../controllers/ReviewController");

router
  .route("/")
  .post([authorizePermissions("admin")], createProduct)
  .get(getAllProducts);

router.route("/uploadImage").post(authorizePermissions("admin"), uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authorizePermissions("admin"), updateProduct)
  .delete(authorizePermissions("admin"), deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
