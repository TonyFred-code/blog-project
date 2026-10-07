import express from "express";
import cors from "cors";

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

app.get("/", (req, res) => {
  res.json({ msg: "Server is up and running" });
});

export default app;
