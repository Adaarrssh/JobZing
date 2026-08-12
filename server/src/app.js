import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import resumeAnalysisRoutes from "./routes/resumeAnalysis.routes.js";
import jobMatcherRoutes from "./routes/jobMatcher.routes.js";
import searchHistoryRoutes from "./routes/searchHistory.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";

import companyRoutes from "./routes/company.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import jobRoutes from "./routes/job.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/resume-analysis", resumeAnalysisRoutes);
app.use("/api/job-match", jobMatcherRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use("/api/companies", companyRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JobZing Backend is running 🚀",
    version: "1.0.0",
  });
});

app.use(errorHandler);

export default app;
