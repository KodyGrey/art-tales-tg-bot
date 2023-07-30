// models.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const chapterSchema = new Schema({
  id: { type: Number, required: true, default: 1 },
  title: { type: String, required: true },
  ratings: {
    bad: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    good: { type: Number, default: 0 },
  },
  fileLocation: { type: String, required: true },
});

const audioStorySchema = new Schema({
  title: { type: String, required: true },
  chapters: [chapterSchema],
  activationCodes: [{ type: String }],
  productLinks: {
    ozon: { type: String },
    wildberries: { type: String },
    landing: { type: String },
    // Add other product links here
  },
  productPhotoLocation: { type: String },
});

const userSchema = new Schema({
  chatId: { type: String, required: true },
  purchasedAudioStories: [
    {
      audioStoryId: { type: Schema.Types.ObjectId, ref: "AudioStory" },
      purchaseDate: { type: Date, default: Date.now },
      chapterRatings: {
        chapterId: { type: Schema.Types.ObjectId, ref: "Chapter" },
        rating: { type: String, enum: ["bad", "neutral", "good"] },
      },
    },
  ],
  chosenAudioStory: { type: Schema.Types.ObjectId, ref: "AudioStory" },
  consentToNotifications: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  agreedToInterview: { type: Boolean, default: false },
});

const AudioStory = mongoose.model("AudioStory", audioStorySchema);
const User = mongoose.model("User", userSchema);

console.log("Schemes are loaded");

export { AudioStory, User };
