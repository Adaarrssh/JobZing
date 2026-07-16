import express from "express";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "../controllers/bookmark.controller.js";

const router = express.Router();

router.post("/", addBookmark);
router.get("/:userId", getBookmarks);
router.delete("/:userId/:jobId", removeBookmark);

export default router;