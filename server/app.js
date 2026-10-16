import "./config/passport.js";
import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/api.route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  process.env.CLIENT_URL, // Production Vercel URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(cookieParser());

app.use("/api", apiRouter);
export default app;
