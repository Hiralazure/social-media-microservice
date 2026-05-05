import "dotenv/config";

import logger from "./utils/logger.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import proxy from "express-http-proxy";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redisClient = new Redis(redisUrl);
redisClient.on("connect", () =>
  logger.info(`Connected to Redis at ${redisUrl}`),
);
redisClient.on("error", (err) => logger.error("Redis connection error", err));

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    });
});

const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: `Internal server error`,
      error: err.message,
    });
  },
};

//setting up proxy for our identity service
app.use(
  "/v1/auth",
  proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from Identity service: ${proxyRes.statusCode}`,
      );

      return proxyResData;
    },
  }),
);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
  logger.info(
    `Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`,
  );

  logger.info(`Redis Url ${process.env.REDIS_URL}`);
});
