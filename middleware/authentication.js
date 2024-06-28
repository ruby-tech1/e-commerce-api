const CustomError = require("../errors/index");
const { isTokenValid } = require("../utils/index");

const AutheticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authetication Invalid");
  }

  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authetication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };

  //   if (req.user.role !== "admin") {
  //     throw new CustomError.UnauthorizedError(
  //       "Unauthorized to access this route"
  //     );
  //   }
  //   next();
};

module.exports = {
  AutheticateUser,
  authorizePermissions,
};
