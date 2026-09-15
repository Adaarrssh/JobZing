import { body, validationResult } from "express-validator";

const gmailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please enter a valid email")
  .custom((value) => {
    if (!value.toLowerCase().endsWith("@gmail.com")) {
      throw new Error("Only Gmail addresses are allowed");
    }

    return true;
  })
  .normalizeEmail();

const passwordValidation = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 10 })
  .withMessage("Password must be at least 10 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password must contain at least one number")
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage("Password must contain at least one special character");

export const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  gmailValidation,

  passwordValidation,

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];

export const loginValidation = [
  gmailValidation,

  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidation = [gmailValidation];

export const resetPasswordValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 10 })
    .withMessage("Password must be at least 10 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};
