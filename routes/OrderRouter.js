const express = require("express");
const router = express.Router();

const { authorizePermissions } = require("../middleware/authentication");
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/OrderController");

router
  .route("/")
  .get(authorizePermissions("admin"), getAllOrders)
  .post(createOrder);

router.route("/showAllMyOrders").get(getCurrentUserOrders);

router.route("/:id").get(getSingleOrder).patch(updateOrder);

module.exports = router;
