const express = require("express");
const router = express.Router();

const { login, logout, register } = require("../controllers/AuthController");

router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/register").post(register);

module.exports = router;
