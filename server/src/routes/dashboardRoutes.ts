import express from "express";
import { dashboard } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";

const dashboardRouter = express.Router();

// Protected route
dashboardRouter.get("/", authMiddleware, dashboard);

export default dashboardRouter;