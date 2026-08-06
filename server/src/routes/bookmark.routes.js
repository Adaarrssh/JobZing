import express from "express";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "../controllers/bookmark.controller.js";

const router = express.Router();

router.get("/", getBookmarks);
router.post("/", addBookmark);
router.delete("/:id", removeBookmark);

export default router;