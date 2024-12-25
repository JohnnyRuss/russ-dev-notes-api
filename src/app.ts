import path from "path";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import { AppError } from "./lib";
import { NODE_MODE } from "./config/env";
import { setHeaders, setCors, setAssetsMiddleware } from "./middlewares/index";
import errorController from "./controllers/errorController";

import articleRoutes from "./routes/article.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import checkHealthRoutes from "./routes/checkHealth.routes";

const App = express();

App.set("view engine", "pug");
App.set("views", path.join(__dirname, "/views"));

App.use(express.json({ limit: "20mb" }));
App.use(express.urlencoded({ extended: true, limit: "20mb" }));
App.use(express.static(path.join(__dirname, "public")));

App.use(setAssetsMiddleware);
App.use(cookieParser());
App.use(setCors());
App.use(setHeaders);
App.use(hpp());
App.use(helmet());
App.use(mongoSanitize());

NODE_MODE === "DEV" && App.use(morgan("dev"));

App.use("/api/v1/health", checkHealthRoutes);
App.use("/api/v1/auth", authRoutes);
App.use("/api/v1/articles", articleRoutes);
App.use("/api/v1/categories", categoryRoutes);

App.all("*", (req, _, next) => {
  next(new AppError(404, `can't find ${req.originalUrl} on this server`));
});

App.use(errorController);

export default App;
