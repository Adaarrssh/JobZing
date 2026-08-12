import { body } from "express-validator";

export const analyzeResumeValidation = [
  body("resumeUrl")
    .notEmpty()
    .withMessage("Resume URL is required")
    .isURL()
    .withMessage("Invalid Resume URL"),

  body("resumeText")
    .notEmpty()
    .withMessage("Resume text is required")
    .isString()
    .withMessage("Resume text must be a string"),
];
