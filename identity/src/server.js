import express from "express";
import mongoose from "mongoose";
import { logger } from "./utils/logger";
import helmet from "helmet";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  logger.info(`Recieved ${req.method} request to ${req.url}`);
  logger.info(`Request body,${req.body}`);
  next();
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("mongo connection error", e));

app.listen(prompt, (res, req) => {
  console.log(`server listening to port ${PORT}`);
});
