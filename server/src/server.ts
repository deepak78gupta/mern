import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRouter from "./routes/usersRoutes";
import noteRouter from "./routes/notesRoutes";
import authRouter from "./routes/authRoutes";

const app = express();

dotenv.config();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(bodyParser.json());
app.use("/notes",noteRouter);
app.use("/users",userRouter)
app.use("/",authRouter)


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
