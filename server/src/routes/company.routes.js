import express from "express";
import {
  getCompanies,
  getCompanyById,
  searchCompanies,
  searchCompanyJobs,
} from "../controllers/company.controller.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/search", searchCompanies);
router.get("/jobs", searchCompanyJobs);
router.get("/:id", getCompanyById);

export default router;
