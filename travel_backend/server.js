import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ PORT fallback (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ✅ Connect DB + Start server safely
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Error ❌:", err.message);
    process.exit(1); // stop app if DB fails
  });