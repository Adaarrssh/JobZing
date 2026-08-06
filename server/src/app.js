import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
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
app.use("/api/companies", companyRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/jobs", jobRoutes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JobZing Backend is running ",
  });
});

export default app;
