import { AudioStory, User } from "../models.js";
import { readFile } from "fs/promises";

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

    const greetingsMessage = await readFile(
      "./src/messages/start_greetingsMessage.txt",
      {
        encoding: "utf8",
      }
    );
    bot.sendMessage(chatId, greetingsMessage);

    const chooseStoryMessage = await readFile(
      "./src/messages/start_chooseStoryMessage.txt",
      {
        encoding: "utf8",
      }
    );
    bot.sendMessage(chatId, chooseStoryMessage, {
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error("Error in 'start':", error);
  }
}
