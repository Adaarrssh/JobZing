import { body, validationResult } from "express-validator";
export const updateProfileValidation = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty"),
  body("phone")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid phone number"),
  body("college").optional().trim(),
  body("degree").optional().trim(),
  body("branch").optional().trim(),
  body("graduationYear")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Please enter a valid graduation year"),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("preferredRole").optional().trim(),
  body("preferredLocation").optional().trim(),
  body("experienceLevel")
    .optional()
    .isIn(["Fresher", "Intern", "Experienced"])
    .withMessage("Invalid experience level"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
];
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};
