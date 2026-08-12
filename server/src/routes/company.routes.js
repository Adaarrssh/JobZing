import express from "express";
import {
  getCompanies,
  getCompanyById,
  searchCompanies,
} from "../controllers/company.controller.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/search", searchCompanies);
router.get("/:id", getCompanyById);

export default router;