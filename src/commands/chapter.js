import { createReadStream } from "fs";
import { readFile } from "fs/promises";

import { AudioStory, User } from "../models.js";

export default async function chapterHandler(bot, callbackQuery) {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data.split(":");

  try {
    const audioStory = await AudioStory.findById(data[1]);

    const chapter = audioStory.chapters.find(
      (el) => el.id.toString() === data[2]
    );

    const audio = createReadStream(`./media/${chapter.fileLocation}`);
    const fileOptions = {
      filename: chapter.title,
    };
    bot.sendAudio(chatId, audio, {}, fileOptions);

    const wishesMessage = await readFile(
      "./src/messages/chapter_wishesMessage.txt",
      { encoding: "utf8" }
    );

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "😒",
            callback_data: `rate:${data[1]}:${data[2]}:bad`,
          },
          {
            text: "😐",
            callback_data: `rate:${data[1]}:${data[2]}:neutral`,
          },
          {
            text: "😊",
            callback_data: `rate:${data[1]}:${data[2]}:good`,
          },
        ],
      ],
    };

    setTimeout(() => {
      bot.sendMessage(chatId, wishesMessage, { reply_markup: keyboard });
    }, 5000);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Ошибка при загрузке главы.");
  }
}
