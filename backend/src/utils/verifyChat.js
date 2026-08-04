import mongoose from "mongoose";
import ChatModel from "../models/chat.model.js";

export const verifyAndGetChat = async (chatId) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    const error = new Error("Invalid Chat ID format");
    error.statusCode = 400;
    throw error;
  }

  const chat = await ChatModel.findById(chatId);
  if (!chat) {
    const error = new Error("Chat not found");
    error.statusCode = 404;
    throw error;
  }

  return chat;
};