import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  archiveChat,
  askQuestion,
  pinUnpinChat,
  generateShareLink,
  joinChat,
  addAccess,
  getAllChat,
  getChatMessage
} from "../controllers/chat.controller.js";
const chatRouter = express.Router();

chatRouter.get("/", (req, res) => {
  res.send("This is the base AI route");
});
chatRouter.post("/ask/:chatId", authUser, askQuestion);
chatRouter.post("/ask", authUser, askQuestion);

chatRouter.put("/pinUnpin/:chatId", authUser, pinUnpinChat);
chatRouter.put("/archive/:chatId", authUser, archiveChat);
chatRouter.put("/generateLink/:chatId", authUser, generateShareLink);
chatRouter.put("/joinchat/:chatId/:seq", authUser, joinChat);
chatRouter.put("/addAccess/:chatId", authUser, addAccess);
chatRouter.get("/getAllChat", authUser, getAllChat);
chatRouter.get("/getchatmessage/:chatId", authUser, getChatMessage);


export default chatRouter;
