import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import passwordResetModel from "../models/passwordReset.model.js";
import emailVerifyModel from "../models/emailVerify.model.js";
import { jwtToken } from "../utils/generateToken.js";
import { sendMail } from "../config/nodemailer.js";
import generateUniqueSeq from "../utils/generateSeq.js";
import AppError from "../utils/ApiError.js";

const addNewUser = async (req, res, next) => {
  try {
    const { email, name, password, confirmPass } = req.body;

    if (!email || !name || !password || !confirmPass) {
      throw new AppError("All Fields are Required", 400);
    }

    if (password !== confirmPass) {
      throw new AppError("Password not matched", 400);
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      throw new AppError("Email is already registred", 400);
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      name,
      password: hashedPass,
    });

    const token = await jwtToken(newUser._id, name, email);
    console.log(token);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        token: token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
  } catch (error) {
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("All Fields are Required", 400);
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError("User is not registred", 404);
    }

    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      throw new AppError("Password not matched", 401);
    }

    const token = await jwtToken(user._id, user.name, user.email);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    next(error);
  }
};

const resetPasswordToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    const checkUser = await UserModel.findOne({ email: email });
    if (!checkUser) {
      throw new AppError("No user found", 404);
    }
    const seq = generateUniqueSeq();

    const updatedToken = await passwordResetModel.findOneAndUpdate(
      { userId: checkUser.id },
      { token: seq, createdAt: new Date() },
      { upsert: true, new: true },
    );
    const link = `${process.env.FRONTEND_URL}/change-password/${seq}/${checkUser._id}`;
    await sendMail(email, "Password Reset Link", link);

    res.status(200).json({
      success: true,
      message: "Link Generated",
    });
  } catch (error) {
    console.error(error);

    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, confirmPass } = req.body;
    const { token, userId } = req.params;

    const getToken = await passwordResetModel.findOne({ userId: userId});

    if (!getToken || getToken.token != token) {
      throw new AppError("Link Expired", 403);
    }

    if (password !== confirmPass) {
      throw new AppError("Password not mathced", 400);
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const updatePassword = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPass },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const sendEmailVerifyLink = async (req, res, next) => {
  try {
    const { user } = req;
    const checkUser = await UserModel.findOne({ _id: user.id });
    if (!checkUser) {
      throw new AppError("No user found", 404);
    }
    const seq = generateUniqueSeq();

    const updatedToken = await emailVerifyModel.findOneAndUpdate(
      { userId: user.id },
      { token: seq, createdAt: new Date() },
      { upsert: true, new: true },
    );
    
    const link = `${process.env.FRONTEND_URL}/change-password/${seq}/${checkUser._id}`;
    await sendMail(req.user.email, "Email Verify Link", link);

    res.status(200).json({
      success: true,
      message: "Link Generated",
    });
  } catch (error) {
    console.error(error);

    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token, userId } = req.params;

    const user = await UserModel.findOne({ _id: userId });
    const getToken = await emailVerifyModel.findOne({ userId: userId });
    if (!getToken || getToken.token !== token) {
      throw new AppError("Link Expired", 403);
    }

    if (!user) {
      throw new AppError("User Not registered", 404);
    }

    user.isMailVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Verified",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export {
  addNewUser,
  Login,
  resetPasswordToken,
  changePassword,
  sendEmailVerifyLink,
  verifyEmail,
};
