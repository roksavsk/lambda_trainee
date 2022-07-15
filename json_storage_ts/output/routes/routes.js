"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = __importDefault(require("../controllers/controllers"));
const router = (0, express_1.Router)();
router.post("/:url", controllers_1.default.add);
router.get("/:url", controllers_1.default.findData);
exports.default = router;
