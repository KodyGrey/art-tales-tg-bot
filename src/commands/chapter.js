import { createReadStream, createWriteStream, read, readFile } from "fs";

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
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Ошибка при загрузке главы.");
  }
}
