import express from "express";
import { testJSearch } from "../controllers/job.controller.js";
import {
  getAllJobs,
  getJobById,
  searchJobs,
  getExternalJobs,
} from "../controllers/job.controller.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/search", searchJobs);
router.get("/test", testJSearch);
router.get("/external", getExternalJobs);
router.get("/:id", getJobById);


export default router;