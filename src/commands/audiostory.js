import { createReadStream } from "fs";
import { readFile } from "fs/promises";

import { AudioStory, User } from "../models.js";

export default async function audioStoryHandler(bot, msg) {
  const chatId = msg.chat.id;

  try {
    const audioStory = await AudioStory.findOne({
      title: msg.text.slice(1, -1),
    });
    if (!audioStory) {
      bot.sendMessage(chatId, "Аудиоистория не найдена");
      return;
    }

    let keyboard = {
      inline_keyboard: [
        [
          audioStory.productLinks.ozon && {
            text: "OZON",
            url: audioStory.productLinks.ozon,
          },
          // audioStory.productLinks.wildberries && {
          //   text: "WB",
          //   url: audioStory.productLinks.wildberries,
          // },
          // audioStory.productLinks.landing && {
          //   text: "На сайте",
          //   url: audioStory.productLinks.landing,
          // },
        ],
      ],
    };

    const sellMessage = await readFile(
      "./src/messages/audiostory_sellMessage.txt"
    );

    if (audioStory.productPhotoLocation) {
      const photo = createReadStream(
        `./media/${audioStory.productPhotoLocation}`
      );
      bot.sendPhoto(chatId, photo, {
        caption: sellMessage,
        reply_markup: keyboard,
      });
    } else {
      bot.sendMessage(chatId, sellMessage, { reply_markup: keyboard });
    }

    const chooseChapterMessage = await readFile(
      "./src/messages/audiostory_chooseChapterMessage.txt"
    );
    setTimeout(() => {
      keyboard = {
        inline_keyboard: audioStory.chapters.map((el) => {
          return [
            {
              text: el.title,
              callback_data: `play:${audioStory._id}:${el.id}`,
            },
          ];
        }),
      };

      bot.sendMessage(chatId, chooseChapterMessage, {
        reply_markup: keyboard,
      });
    }, 5000);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Ошибка при загрузке аудиоистории.");
  }
}
