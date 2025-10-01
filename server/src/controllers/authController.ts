import { Request, Response } from "express";
import { OkPacket } from "mysql2";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "myapp",
});

const SECRET = "MY_SECRET_KEY";

export const signup = async (req: Request, res: Response) => {

    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // 2. Check if email already exists
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if ((existing as any).length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)

        // 4. Insert into database
        const [result] = await db.query<OkPacket>(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        // 5. Return response
        res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const [rows]: any = await db.query("SELECT * FROM users WHERE email=?", [email]);
        if (rows.length === 0) return res.status(400).json({ error: "User not found" });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
        res.json({ token, name: user.name, email: user.email });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // only over HTTPS
            maxAge: 3600000 // 1 hour
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
}

export const logout = (req: Request, res: Response) => {

    res.json({ message: "Logout successful" });
}