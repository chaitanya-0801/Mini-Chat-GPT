import jwt from "jsonwebtoken";
import AppError from "../utils/ApiError.js";

export const authUser = async (req, res, next) => {
  try {
    let token = req.headers["authorization"] || req.cookies?.token;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Access Denied No Token Provided", 401));
    }
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedPayload;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authUser;
