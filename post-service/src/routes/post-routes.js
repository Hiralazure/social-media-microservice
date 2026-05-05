import express from "express";
import { authenticatedRequest } from "../middleware/auth-middleware.js";
import { createPost } from "../controllers/post.controller.js";
export const postRoutes = express.Router();
postRoutes.use(authenticatedRequest);
postRoutes.post("/create-post", createPost);
