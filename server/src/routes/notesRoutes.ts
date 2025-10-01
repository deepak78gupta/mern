import express, { Request, Response } from "express";
import { createNote, deleteNote, getAllNotes, updateNote } from "../controllers/notesController";

const noteRouter = express.Router();


noteRouter.get("/", getAllNotes);      // → GET /notes   (saare notes laane ke liye)
noteRouter.post("/", createNote);      // → POST /notes  (naya note create karne ke liye)
noteRouter.put("/:id", updateNote);    // → PUT /notes/123 (id=123 wale note ko update karne ke liye)
noteRouter.delete("/:id", deleteNote); // → DELETE /notes/123 (id=123 wale note ko delete karne ke liye)



export default noteRouter;