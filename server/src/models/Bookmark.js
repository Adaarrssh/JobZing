import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  salary: {
    type: String,
    default: "",
  },
  jobType: {
    type: String,
    default: "",
  },
  experience: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  applyLink: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Bookmark", bookmarkSchema);
