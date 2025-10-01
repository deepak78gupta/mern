import express, { Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, updateUser } from "../controllers/userController";

const userRouter = express.Router();


userRouter.get("/", getAllUsers);      // → GET /Users   (saare Users laane ke liye)
userRouter.post("/", createUser);      // → POST /Users  (naya User create karne ke liye)
userRouter.put("/:id", updateUser);    // → PUT /Users/123 (id=123 wale User ko update karne ke liye)
userRouter.delete("/:id", deleteUser); // → DELETE /Users/123 (id=123 wale User ko delete karne ke liye)


export default userRouter;