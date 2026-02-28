import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db.js";
import path from "path";
import invoiceRouter from "./routes/invoiceRouter.js";
import businessProfileRouter from "./routes/businessProfileRouter.js";
import aiInvoiceRouter from "./routes/aiInvoiceRouter.js";
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLE WARES
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// DB
connectDB();

// Static uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ROUTES
app.use("/api/invoice", invoiceRouter);
app.use("/api/businessProfile", businessProfileRouter);
app.use("/api/ai", aiInvoiceRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, () => {
  console.log(`Server started on htttp://localhost:${PORT}`);
});
