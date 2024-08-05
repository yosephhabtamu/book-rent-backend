"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await models_1.User.create({ username, password: hashedPassword, role: 'user' });
    res.status(201).json(user);
};
exports.register = register;
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await models_1.User.findOne({ where: { username } });
    if (user && await bcrypt_1.default.compare(password, user.password)) {
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token });
    }
    else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
exports.login = login;
