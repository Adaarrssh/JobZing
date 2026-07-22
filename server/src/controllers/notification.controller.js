import Notification from "../models/notification.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
export const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, referenceId, referenceType } = req.body;
  const notification = await Notification.create({
    userId: req.user._id,
    title,
    message,
    type,
    referenceId,
    referenceType,
  });
  return res
    .status(201)
    .json(
      new ApiResponse(201, notification, "Notification created successfully"),
    );
});
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully"),
    );
});
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    {
      isRead: true,
    },
    {
      new: true,
    },
  );
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    {
      userId: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
    },
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "All notifications marked as read",
    ),
  );
});
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Notification deleted successfully"));
});
