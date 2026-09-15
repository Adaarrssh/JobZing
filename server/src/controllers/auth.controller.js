import crypto from "crypto";

import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "This email is already in use.");
  }

  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
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

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    throw new ApiError(401, "No account found with this email.");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password.");
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

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordResetToken +passwordResetExpires",
  );

  if (!user) {
    throw new ApiError(404, "No account found with this email.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const emailSubject = "Reset your JobZing password";

  const emailText = `Hello ${user.fullName},

We received a request to reset your JobZing password.

Use the link below to create a new password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

JobZing`;

  try {
    await sendEmail({
      to: user.email,
      subject: emailSubject,
      text: emailText,
    });
  } catch (error) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      500,
      "Unable to send password reset email. Please try again later.",
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password reset link has been sent to your email.",
      ),
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match.");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new ApiError(
      400,
      "This password reset link is invalid or has expired.",
    );
  }

  user.password = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password reset successfully. Please sign in with your new password.",
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
