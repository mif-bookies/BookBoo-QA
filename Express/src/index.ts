import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import WebhookRouter from "./webhook";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
