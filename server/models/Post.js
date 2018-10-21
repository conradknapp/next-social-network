import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Post content is required"
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "User" }
    }
  ],
  postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Post", postSchema);
