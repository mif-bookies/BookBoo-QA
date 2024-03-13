import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import BookRouter from "./book";
import CollectionRouter from "./collection";
import RecommendationRouter from "./recommendation";
import WebhookRouter from "./webhook";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      sessionClaims: {
        [key: string]: any;
      };
      sessionId: string;
      userId: string;
      claims: {
        [key: string]: any;
      };
    };
  }
}

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode.");
  dotenv.config({ path: ".prod.env" });
} else {
  console.log("Running in development mode.");
  dotenv.config({ path: ".dev.env" });
}

const { PORT } = process.env;

const app = express();
app.use(cors());

app.use((req, res, next) => {
  if (req.path !== "/api/webhooks") {
    return express.json()(req, res, next);
  }
  next();
});

app.use(WebhookRouter);
app.use(BookRouter);
app.use(RecommendationRouter);
app.use(CollectionRouter);

app.get("/api/protected-endpoint", ClerkExpressRequireAuth(), (req, res) => {
  if (!req.auth) {
    return res.status(401).send("Unauthorized request!");
  }
  res.json(req.auth);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
