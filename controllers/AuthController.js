const User = require("../models/User");
const { attachCookieToResponse, createTokenUser } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError("Email already exist");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ email, name, password, role });
  const tokenUser = createTokenUser({ user });

  attachCookieToResponse({ res, tokenUser });

  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError(
      "Please provide valid credentials"
    );
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new CustomError.UnauthenticatedError(
      "Please provide valid credentials"
    );
  }

  const tokenUser = createTokenUser({ user });
  attachCookieToResponse({ res, tokenUser });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
  });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ sucess: true });
};

module.exports = {
  login,
  logout,
  register,
};
