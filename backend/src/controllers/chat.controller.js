import mongoose from "mongoose";

import ChatModel from "../models/chat.model.js";
import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";
import { generateResponse } from "../utils/generateResponse.js";
import { verifyAndGetChat } from "../utils/verifyChat.js";
import generateUniqueSeq from "../utils/generateSeq.js";
import { sendMail } from "../config/nodemailer.js";
import AppError from "../utils/ApiError.js";

const askQuestion = async (req, res, next) => {
  try {
    const { user } = req;
    const { prompt } = req.body;
    const { chatId } = req.params;

    let chat;

    if (!chatId) {
      const aiResponse = await generateResponse(`Genrtae a single  name for chat with following prompt do not give any other text with that    ${prompt}`);
      console.log(aiResponse)
      const noOfChats = await ChatModel.countDocuments({
        owner: user.id,
      });

      chat = await ChatModel.create({
        name: aiResponse,
        owner: user.id,
      });
    } else {
      chat = await ChatModel.findById(chatId).populate("messages");

      if (!chat) {
        throw new AppError("Chat Not Found", 404);
      }
    }

    const contents = chat.messages.map((message) => ({
      role: message.ownerType === "user" ? "user" : "model",
      parts: [
        {
          text: message.content,
        },
      ],
    }));

    // Add current prompt
    contents.push({
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    });

    // Generate AI response
    const aiResponse = await generateResponse(contents);

    // Save user message
    const userMessage = await MessageModel.create({
      content: prompt,
      ownerType: "user",
      user: user.id,
    });

    // Save AI message
    const assistantMessage = await MessageModel.create({
      content: aiResponse,
      ownerType: "AI",
      user: user.id,
    });

    // Update chat
    chat = await ChatModel.findByIdAndUpdate(
      chat._id,
      {
        $push: {
          messages: {
            $each: [userMessage._id, assistantMessage._id],
          },
        },
      },
      {
        new: true,
      },
    ).populate("messages");

    return res.status(200).json({
      success: true,
      message: "Response generated successfully",
      data: {
        chat,
        userMessage,
        assistantMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const pinUnpinChat = async (req, res, next) => {
  try {
    const { user } = req;
    const { chatId } = req.params;
    const chat = await verifyAndGetChat(chatId);
    const email_verified = await UserModel.findById(user.id).select(
      "isMailVerified",
    );
    console.log(email_verified);
    if (!email_verified.isMailVerified) {
      throw new AppError("Email is Not verified Kindly verify Email", 400);
    }
    chat.isPinned = !chat.isPinned;
    await chat.save();

    res.status(200).json({
      success: true,
      message: chat.isPinned
        ? "Chat pinned successfully"
        : "Chat unpinned successfully",
      chat,
    });
  } catch (error) {

    next(error);
  }
};
const archiveChat = async (req, res, next) => {
  try {
    const { user } = req;
    const { chatId } = req.params;
    const chat = await verifyAndGetChat(chatId);

    const email_verified = await UserModel.findById(user.id).select(
      "isMailVerified",
    );
    console.log(email_verified);
    if (!email_verified.isMailVerified) {
      throw new AppError("Email is Not verified Kindly verify Email", 400);
    }

    chat.isArchived = !chat.isArchived;
    await chat.save();

    res.status(200).json({
      success: true,
      message: chat.isArchived
        ? "Chat added to Archived successfully"
        : "Chat removed from Archived successfully",
      chat,
    });
  } catch (error) {

    next(error);
  }
};

const generateShareLink = async (req, res, next) => {
  try {
    const { user } = req;
    const { chatId } = req.params;
    const chat = await verifyAndGetChat(chatId);
    if (chat.owner != user.id) {
      throw new AppError("Only Owner can generate link", 400);
    }
    const email_verified = await UserModel.findById(user.id).select(
      "isMailVerified",
    );
    console.log(email_verified);
    if (!email_verified.isMailVerified) {
      throw new AppError("Email is Not verified Kindly verify Email", 400);
    }
    const seq = generateUniqueSeq();
    const link = `${process.env.FRONTEND_URL}/join-chat/${seq}/${chat._id}`;
    chat.shareLink = seq;
    await chat.save();

    return res.status(200).json({
      success: true,
      chat,
      link,
    });
  } catch (error) {

    next(error);
  }
};

const joinChat = async (req, res, next) => {
  try {
    const { user } = req;
    const { chatId, seq } = req.params;

    const chat = await verifyAndGetChat(chatId);
    if (!chat) {
      throw new AppError("Chat Not Found", 404);
    }

    if (seq != chat.shareLink) {
      throw new AppError("Link Expired", 403);
    }

    if (chat.owner == user.id) {
      throw new AppError("You are owner of this Chat", 400);
    }

    if (chat.accessHolders.includes(user.id)) {
      throw new AppError("All ready have Access", 400);
    }

    chat.accessHolders.push(user.id);
    await chat.save();

    return res.status(200).json({
      success: true,
      message: "Access Updated",
    });
  } catch (error) {
    next(error);
  }
};

const addAccess = async (req, res, next) => {
  try {
    const { user } = req;
    const { emails } = req.body;
    const { chatId } = req.params;
    console.log(emails);

    const chat = await verifyAndGetChat(chatId);

    if (user.id != chat.owner) {
      throw new AppError("Only Owner can add", 400);
    }
    const email_verified = await UserModel.findById(user.id).select(
      "isMailVerified",
    );
    console.log(email_verified);
    if (!email_verified.isMailVerified) {
      throw new AppError("Email is Not verified Kindly verify Email", 400);
    }
    const allEmails = typeof emails === "string" ? JSON.parse(emails) : emails;

    const existingUsers = await UserModel.find({
      email: { $in: allEmails },
      _id: { $nin: chat.accessHolders },
    });

    const existingEmails = existingUsers.map((user) => user.email);
    const missingEmails = allEmails.filter(
      (email) => !existingEmails.includes(email),
    );

    const userIdsToPush = existingUsers.map((user) => user._id);

    chat.accessHolders.push(...userIdsToPush);
    await chat.save();
    const link = `${process.env.FRONTEND_URL}/?chatId=${chat._id}`;
    const emailPromises = existingUsers.map((targetUser) => {
      return sendMail(
        targetUser.email,
        `New Chat Shared by ${req.user.name}`,
        link,
      );
    });

    await Promise.all(emailPromises);

    return res.status(200).json({
      success: true,
      message: `Access Updated for ${existingEmails.length}`,
      emailNotUpdated: missingEmails,
    });
  } catch (error) {
    next(error);
  }
};

const getAllChat = async (req, res, next) => {
  try {
    const { user } = req;

    const userChat = await ChatModel.find({ owner: user.id });
    const sharedChat = await ChatModel.find({ accessHolders: user.id });

    res.status(200).json({
      success: true,
      userChat,
      sharedChat,
    });
  } catch (error) {
    next(error);
  }
};

const getChatMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await ChatModel.findById(chatId).populate("messages");
    if (!chat) {
      throw new AppError("Internal Error", 500);
    }
    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    next(error);
  }
};

export {
  askQuestion,
  pinUnpinChat,
  archiveChat,
  joinChat,
  addAccess,
  generateShareLink,
  getAllChat,
  getChatMessage,
};
