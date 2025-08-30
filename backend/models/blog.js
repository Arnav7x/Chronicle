const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    // Author (reference to User)
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Moderation status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Tracking fields
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    // Prevent multiple likes from same user
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Comments
    comments: [
      {
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who commented
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

module.exports = mongoose.model("Blog", blogSchema);

