"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notesController_1 = require("../controllers/notesController");
const router = express_1.default.Router();
router.get("/api/notes", notesController_1.getAllNotes);
exports.default = router;
//# sourceMappingURL=notesRoute.js.map