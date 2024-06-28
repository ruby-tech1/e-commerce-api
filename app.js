require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// Rest of the Packages
const morgan = require("morgan"); /// For showing the info on every routes
const cookieParser = require("cookie-parser"); // For accessing cookies from request
const fileUpload = require("express-fileupload");

// Security
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

// Database
const connectDB = require("./db/connect");

// Routes
const AuthRouter = require("./routes/AuthRouter");
const UserRouter = require("./routes/UserRouter");
const ProductRouter = require("./routes/ProductRouter");
const ReviewRouter = require("./routes/ReviewRouter");
const OrderRouter = require("./routes/OrderRouter");

// Autheticate Routes
const { AutheticateUser } = require("./middleware/authentication");

// Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // Added the scret to sign the cookie

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("E-Commerce");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("E-Commerce");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", AutheticateUser, UserRouter);
app.use("/api/v1/products", AutheticateUser, ProductRouter);
app.use("/api/v1/review", ReviewRouter);
app.use("/api/v1/order", AutheticateUser, OrderRouter);

// Error Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
