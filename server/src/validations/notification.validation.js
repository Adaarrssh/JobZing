import { body, validationResult } from "express-validator";
export const createNotificationValidation = [
  body("title").trim().notEmpty().withMessage("Notification title is required"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Notification message is required"),
  body("type")
    .isIn(["job", "resume", "application", "profile", "system", "ai"])
    .withMessage("Invalid notification type"),
  body("referenceId")
    .optional()
    .isMongoId()
    .withMessage("Invalid reference ID"),
  body("referenceType").optional().trim(),
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
