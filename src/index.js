import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import { createReadStream, createWriteStream, read, readFile } from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";

import { AudioStory, User } from "./models.js";
import startHandler from "./commands/start.js";
import audioStoryHandler from "./commands/audiostory.js";
import chapterHandler from "./commands/chapter.js";
import chapterRatingHandler from "./commands/chapterRating.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => await startHandler(bot, msg));

bot.onText(/^".+"$/, async (msg) => await audioStoryHandler(bot, msg));

bot.on("callback_query", async (callbackQuery) => {
  const data = callbackQuery.data.split(":");
  if (data[0] === "play") await chapterHandler(bot, callbackQuery);
  else if (data[0] === "rate") await chapterRatingHandler(bot, callbackQuery);
});

bot.on("polling_error", console.error);
