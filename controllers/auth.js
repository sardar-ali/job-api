const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const user = await User.create(req.body);
  return res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Register user successfully",
    data: { token: user.createJwt(), user },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Invalid username or password!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Email not found!");
  }

  const isMatch = await user.comparePassword(password, user.password);

  if (!isMatch) {
    throw new UnauthenticatedError("Invalid password!");
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    msg: "user login successfully",
    token: user.createJwt(),
    user,
  });
};

module.exports = {
  register,
  login,
};
