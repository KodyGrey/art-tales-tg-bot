import { AudioStory, User } from "../models.js";

export default async function startHandler(bot, msg) {
  const chatId = msg.chat.id;

  try {
    let user = await User.findOne({ chatId });
    if (!user) {
      user = new User({ chatId, consentToNotifications: true });
      user.save();
    }

    const audioStories = await AudioStory.find({}, "title");
    const keyboard = {
      keyboard: audioStories.map((story) => [`"${story.title}"`]),
      one_time_keyboard: true,
      resize_keyboard: true,
    };

    bot.sendMessage(chatId, "Привет! Выберите аудиоисторию:", {
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error("Error fetching from db:", error);
  }
}
