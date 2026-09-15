import express from "express";

import {
  testJSearch,
  getAllJobs,
  getJobById,
  searchJobs,
  getExternalJobs,
} from "../controllers/job.controller.js";

import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", optionalAuth, getAllJobs);

router.get("/search", searchJobs);

router.get("/test", testJSearch);

router.get("/external", getExternalJobs);

router.get("/:id", getJobById);

export default router;
