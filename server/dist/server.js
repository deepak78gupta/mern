"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const promise_1 = __importDefault(require("mysql2/promise"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const notesRoute_1 = __importDefault(require("./routes/notesRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173"
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
console.log(process.env.PORT);
app.use(body_parser_1.default.json());
app.use("/", notesRoute_1.default);
const db = promise_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "myapp",
});
const SECRET = "MY_SECRET_KEY";
//-----------------------------------products-----------------------------------------
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db.query("SELECT * FROM products");
    res.json(rows);
}));
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, stock } = req.body; // ✅ match frontend
    try {
        // Check if user with same email already exists
        const [rows] = yield db.query("SELECT * FROM users WHERE email = ?", [name]);
        if (rows.length > 0) {
            return res.status(400).json({ error: "Product with this name already exists" });
        }
        const [result] = yield db.query("INSERT INTO products ( name, description,price,stock) VALUES (?, ?, ?, ?)", [name, description, price, stock]);
        res.json({ id: result.insertId, name, description, price, stock }); // ✅ return same shape as frontend expects
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database insert failed" });
    }
}));
app.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ id });
}));
//------------------------------------users-------------------------------------------
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db.query("SELECT id, name, email FROM users"); // password hata diya
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email } = req.body; // ✅ flexible update
    try {
        yield db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
            name,
            email,
            id,
        ]);
        res.json({ id, name, email });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database update failed" });
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ id });
}));
//-----------------------------------signup login, logout-------------------------
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // 1. Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        // 2. Check if email already exists
        const [existing] = yield db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }
        // 3. Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        console.log(hashedPassword);
        // 4. Insert into database
        const [result] = yield db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        // 5. Return response
        res.status(201).json({ id: result.insertId, name, email });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Signup failed" });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const [rows] = yield db.query("SELECT * FROM users WHERE email=?", [email]);
        if (rows.length === 0)
            return res.status(400).json({ error: "User not found" });
        const user = rows[0];
        const match = yield bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
        res.json({ token, name: user.name, email: user.email });
    }
    catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
}));
app.post("/logout", (req, res) => {
    res.json({ message: "Logout successful" });
});
app.get("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        res.json({ message: "Welcome!", user: decoded });
    }
    catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}));
//----------------------------------------------------------
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
//# sourceMappingURL=server.js.map