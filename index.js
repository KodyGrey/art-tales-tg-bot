import TelegramBot from "node-telegram-bot-api";
import { createReadStream, createWriteStream, read, readFile } from "fs";
import csv from "csv-parser";

const token = process.env.TG_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", function (msg) {
  const chatId = msg.chat.id;

  const video = createReadStream("./media/waiting.mp4");

  readFile("./message.txt", "utf-8", (err, messageText) => {
    bot.sendVideo(chatId, video, {
      caption: messageText,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Сообщите мне об обновлениях!",
              callback_data: "subscribe_to_updates",
            },
          ],
        ],
      },
      parse_mode: "Markdown",
    });

    const result = [];
    let userInDb = false;

    createReadStream("./users.csv")
      .pipe(csv())
      .on("data", (row) => {
        if (row.chatId === chatId.toString()) userInDb = true;
        result.push([row.userId, row.chatId, row.subscribed]);
      })
      .on("end", () => {
        if (!userInDb) {
          const writer = createWriteStream("./users.csv");
          const headers = ["userId", "chatId", "subscribed"];
          writer.write(headers.join(","));
          for (let el of result) {
            writer.write("\n" + el.join(","));
          }
          writer.write(
            "\n" +
              [msg.from.id.toString(), chatId.toString(), "false"].join(",")
          );
        }
      });
  });
});

bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  if (data === "subscribe_to_updates") {
    const result = [];

    createReadStream("./users.csv")
      .pipe(csv())
      .on("data", (row) => {
        if (row.chatId === chatId.toString()) row.subscribed = "true";
        result.push([row.userId, row.chatId, row.subscribed]);
      })
      .on("end", () => {
        const writer = createWriteStream("./users.csv");
        const headers = ["userId", "chatId", "subscribed"];
        writer.write(headers.join(","));
        for (let el of result) {
          writer.write("\n" + el.join(","));
        }
        writer.write(
          "\n" + [msg.from.id.toString(), chatId.toString(), "false"].join(",")
        );
        bot.answerCallbackQuery(callbackQuery.id, {
          text: "Благодарим за подписку на обновления 🥰",
        });
      });
  }
});

bot.on("polling_error", console.log);
