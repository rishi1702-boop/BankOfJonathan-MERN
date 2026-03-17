import express from "express"
import dotenv from "dotenv";
import userroute from "./routes/userroute.js"
import Transaction from "./routes/Transaction.js"
import AiRoute from "./routes/Gemini.js"
import adminRoute from "./routes/adminRoute.js"
import {connectDB} from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import globalErrorHandler from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

import path from "path";
import { fileURLToPath } from "url";
const app = express()
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=><",__dirname)
// serve dist
const frontendPath = path.resolve(__dirname, "../Frontend/SmartBank/dist");
app.use(express.static(frontendPath));


const APP_DIR = "../Frontend/SmartBank/dist"
// app.get("/(.*)/", (req, res) => {
//   res.sendFile(path.j(frontendPath, "index.html"));
// });



//https://BankOfJonathan-3q8n.onrender.com
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : "http://localhost:5173",  // allow deployed frontend or local
  credentials: true,                // allow cookies to be sent
}));

// Set Security HTTP Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP temporarily to avoid breaking frontend assets if served from same origin without proper setup
}));

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use('/auth', limiter); // Apply rate limiter strategy specifically to auth or globally depending on preference, applied to auth here for brute force protection.

app.use(express.json({ limit: '10kb' })); // Body parser, reading data from body into req.body with size limit
app.use(cookieParser());
app.use('/auth',userroute)
app.use('/payment',Transaction)
app.use("/ai",AiRoute)
app.use('/admin', adminRoute)



const port = process.env.PORT || 3000

// Serve frontend paths
app.get('*.*', express.static(path.join(__dirname, APP_DIR)));
app.all('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/')) { // Only handle API routes differently if they had an /api prefix, for now catch all non-files
     // Actually, if it's a frontend route, we need to send index.html.
     // Let's pass API 404s to Error Handler, and send index.html for others.
     if(req.originalUrl.startsWith('/auth') || req.originalUrl.startsWith('/payment') || req.originalUrl.startsWith('/ai')  || req.originalUrl.startsWith('/admin')) {
        return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
     }
     res.sendFile(path.join(__dirname, APP_DIR, 'index.html'))
  }
})

app.use(globalErrorHandler);

connectDB().then(()=>{
    app.listen(port,()=>{
    console.log("server running on port",port);
})
})
