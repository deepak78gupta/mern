// server/src/controllers/userController.ts
import { Request, Response } from 'express';
import { db } from '../db/mysql';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT id, name, email FROM users"); // password hata diya
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body; // ✅ match frontend
  try {
    // Check if user with same email already exists
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [name]
    );

    if ((rows as any).length > 0) {
      return res.status(400).json({ error: "Product with this name already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO users ( name, description,price,stock) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.json({ id: (result as any).insertId, name, email, password }); // ✅ return same shape as frontend expects
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database insert failed" });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body; // ✅ flexible update
  try {
    await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      id,
    ]);
    res.json({ id, name, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database update failed" });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.query("DELETE FROM users WHERE id = ?", [id]);
  res.json({ id });
}