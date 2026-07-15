import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateToken from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const token = generateToken(user._id);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      "User registered successfully",
    ),
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      "Login successful",
    ),
  );
});

export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
