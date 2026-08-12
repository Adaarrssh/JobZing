import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getJobMatchController } from "../controllers/jobMatcher.controller.js";

const router = express.Router();

router.post("/", protect, getJobMatchController);

export default router;
