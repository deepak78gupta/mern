import express, { Request, Response } from "express";
import { login, signup } from "../controllers/authController";

const authRouter = express.Router();


authRouter.post("/login", login);      // → GET /notes   (saare notes laane ke liye)
authRouter.post("/signup", signup);      // → POST /notes  (naya note create karne ke liye)



export default authRouter;