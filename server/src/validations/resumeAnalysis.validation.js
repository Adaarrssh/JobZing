import { body } from "express-validator";

export const analyzeResumeValidation = [
  body("resumeUrl").optional().isURL().withMessage("Invalid Resume URL"),
];
