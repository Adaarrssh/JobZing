import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [10, "Password must be at least 10 characters long"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

    college: {
      type: String,
      trim: true,
    },

    degree: {
      type: String,
      trim: true,
    },

    branch: {
      type: String,
      trim: true,
    },

    graduationYear: {
      type: Number,
    },

    skills: [
      {
        type: [String],
        trim: true,
        default: [],
      },
    ],

    preferredRole: {
      type: String,
      trim: true,
    },

    preferredLocation: {
      type: String,
      trim: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "Intern", "Experienced"],
      default: "Fresher",
    },

    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
