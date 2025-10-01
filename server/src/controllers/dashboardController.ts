import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET = "MY_SECRET_KEY";

export const dashboard = (req: Request, res: Response) => {
   const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ message: "Welcome!", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
