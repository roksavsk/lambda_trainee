"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, body_parser_1.json)());
app.use('/storage', routes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to JSON storage!');
});
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
