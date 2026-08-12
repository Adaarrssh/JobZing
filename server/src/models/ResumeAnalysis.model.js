import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    resumeText: {
      type: String,
      required: true,
      trim: true,
    },

    resumeScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    existingSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    missingSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    recommendedSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    recommendedRoles: [
      {
        type: String,
        trim: true,
      },
    ],

    improvementSuggestions: [
      {
        type: String,
        trim: true,
      },
    ],

    analysisStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;
