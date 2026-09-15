import express from "express";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "../controllers/bookmark.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBookmarks);
router.post("/", protect, addBookmark);
router.delete("/:id", protect, removeBookmark);

export default router;
