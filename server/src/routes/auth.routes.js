import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
  validate,
} from "../validations/auth.validation.js";
const router = express.Router();
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
export default router;
