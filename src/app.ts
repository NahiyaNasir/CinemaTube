import express, { Application, Request, Response } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

import { toNodeHandler } from "better-auth/node";
import path from "path";
import { envVars } from "./app/config/env";
import { auth } from "./app/lib/auth";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalError";
import { notFound } from "./app/middlewares/notFound";

const app: Application = express();
// app.post("/webhook", express.raw({ type: "application/json" }),PaymentController.handleStripeWebhookEvent )
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
app.use("/api/auth", toNodeHandler(auth))
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "API is working",
  });
  res.send("Hello, World!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
