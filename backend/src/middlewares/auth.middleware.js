import jwt from "jsonwebtoken";
import AppError from "../utils/ApiError.js";

export const authUser = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers["authorization"];

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      return new AppError("Access Denied No Token Provided", 401);
    }
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedPayload;

    next();
  } catch (error) {
     new AppError("Invalid or expired token", 401);
  }
};

export default authUser;
