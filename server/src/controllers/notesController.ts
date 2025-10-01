import { Request, Response } from "express";

export const getAllNotes = (req: Request, res: Response) => {
  res.json([{ id: 1, title: "First Note" }]);
};

export const createNote = (req: Request, res: Response) => {
    console.log(req.body)
  const { count } = req.body;
  console.log(count)
  res.status(201).json({ message: "Note created", count });
};

export const updateNote = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  res.json({ message: `Note ${id} updated`, title });
};

export const deleteNote = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Note ${id} deleted` });
};
