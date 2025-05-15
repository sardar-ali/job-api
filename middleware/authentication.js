const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  console.log({ requresHeader: req.headers, token: authHeaders });
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const accessToken = authHeaders.split(" ")[1];
  try {
    const decodedToken = await jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log({ decodedToken });
    req.user = { userId: decodedToken.userId, name: decodedToken.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authMiddleware;
