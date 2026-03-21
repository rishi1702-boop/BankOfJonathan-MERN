import express from "express"
import dotenv from "dotenv";
import userroute from "./routes/userroute.js"
import Transaction from "./routes/Transaction.js"
import AiRoute from "./routes/Gemini.js"
import adminRoute from "./routes/adminRoute.js"
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // ✅ Move dotenv.config() BEFORE using process.env

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix 1: Properly parse FRONTEND_URL and trim spaces
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ''))
  : ["http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(helmet({
  contentSecurityPolicy: false,
}));

const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use('/auth', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// API Routes
app.use('/auth', userroute);
app.use('/payment', Transaction);
app.use("/ai", AiRoute);
app.use('/admin', adminRoute);

// ✅ Fix 2: Only serve static frontend if you're doing SSR/monorepo
// If frontend is on Vercel and backend is on Render — REMOVE these lines below
// and delete the static serving block entirely.

// ❌ REMOVE THIS if frontend is deployed separately on Vercel:
// const APP_DIR = '../frontend/dist'; // was never defined
// app.get('*.*', express.static(path.join(__dirname, APP_DIR)));
// app.all('*', ...)

// ✅ Instead, just handle unknown API routes with 404
app.all('*', (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server running on port", port);
  });
});