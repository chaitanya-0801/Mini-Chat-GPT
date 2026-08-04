import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { connectDB } from "./config/datebase.js";
import chatRouter from "./routes/chat.routes.js";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middelware.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173",];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello this is backend of mini chat gpt");
});

app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`);
  });
});
