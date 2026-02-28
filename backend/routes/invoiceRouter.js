import { clerkMiddleware } from "@clerk/express";
import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoice,
} from "../controller/invoiceControllers.js";

const invoiceRouter = express.Router();

invoiceRouter.use(clerkMiddleware());

invoiceRouter.get("/", getInvoices);
invoiceRouter.get("/:id", getInvoiceById);
invoiceRouter.post("/", createInvoice);
invoiceRouter.put("/:id", updateInvoice);
invoiceRouter.delete("/:id", deleteInvoice);

export default invoiceRouter;
