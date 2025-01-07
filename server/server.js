import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import upload from "express-fileupload";

import Routes from "./routes/Routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload());

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    credentials: true, // Allows cookies and headers
  })
);
// Use routes
app.use("/api", Routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
