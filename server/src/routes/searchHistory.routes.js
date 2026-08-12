import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
} from "../controllers/searchHistory.controller.js";

const router = express.Router();

router.post("/", protect, createSearchHistory);
router.get("/", protect, getSearchHistory);
router.delete("/:id", protect, deleteSearchHistory);

export default router;
