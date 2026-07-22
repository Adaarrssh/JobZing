import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import {
  createNotificationValidation,
  validate,
} from "../validations/notification.validation.js";
const router = express.Router();
router.post(
  "/",
  protect,
  createNotificationValidation,
  validate,
  createNotification,
);
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);
export default router;
