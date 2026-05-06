import express from "express";
import { authenticatedRequest } from "../middleware/auth-middleware.js";
import {
  createPost,
  getAllPost,
  getPost,
  deletePost,
} from "../controllers/post.controller.js";
export const postRoutes = express.Router();
postRoutes.use(authenticatedRequest);
postRoutes.post("/create-post", createPost);
postRoutes.get("/get-post", getAllPost);
postRoutes.get("/:id", getPost);
postRoutes.delete("/:id", deletePost);
