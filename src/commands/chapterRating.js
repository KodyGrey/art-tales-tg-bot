import { AudioStory, User } from "../models.js";

export default async function chapterRatingHandler(bot, callbackQuery) {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data.split(":");

  try {
    const audioStory = await AudioStory.findById(data[1]);

    const chapter = audioStory.chapters.find(
      (el) => el.id.toString() === data[2]
    );

    let flag = chapter.ratings.bad.find((el) => el === chatId.toString());
    flag =
      flag || chapter.ratings.neutral.find((el) => el === chatId.toString());
    flag = flag || chapter.ratings.good.find((el) => el === chatId.toString());
    if (flag) {
      bot.editMessageText("Вы уже поставили оценку этой главе", {
        chat_id: chatId,
        message_id: msg.message_id,
      });
      return;
    }

    audioStory.chapters[audioStory.chapters.indexOf(chapter)].ratings[
      data[3]
    ].push(chatId);

    audioStory.save();

    bot.editMessageText("Спасибо за вашу оценку!🥰", {
      chat_id: chatId,
      message_id: msg.message_id,
    });
  } catch (error) {
    console.error(error);
  }
}
