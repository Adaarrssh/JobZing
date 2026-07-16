import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import {
  updateProfileValidation,
  validate,
} from "../validations/user.validation.js";
const router = express.Router();
router.get("/profile", protect, getProfile);
router.put(
  "/profile",
  protect,
  updateProfileValidation,
  validate,
  updateProfile,
);
export default router;
