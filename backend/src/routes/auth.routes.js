import express from "express";
const authRouter = express.Router();

import {
  Login,
  addNewUser,
  sendEmailVerifyLink,
  verifyEmail,
  resetPasswordToken,
  changePassword,
  googleLogin
} from "../controllers/user.controller.js";
import authUser from "../middlewares/auth.middleware.js";

authRouter.post("/signup", addNewUser);
authRouter.post('/google',googleLogin)
authRouter.post("/login", Login);

authRouter.post("/password-reset-token", resetPasswordToken);
authRouter.put("/change-password/:token/:userId", changePassword);

authRouter.post("/email-verify-link", authUser, sendEmailVerifyLink);
authRouter.put("/verify-email/:token/:userId", verifyEmail);

export default authRouter;
