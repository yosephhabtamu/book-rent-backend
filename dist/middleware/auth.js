"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineAbilitiesFor = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ability_1 = require("@casl/ability");
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.authenticate = authenticate;
const defineAbilitiesFor = (user) => {
    const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.Ability);
    if (user.role === 'admin') {
        can('manage', 'all');
    }
    else {
        can('read', 'Book');
        can('rent', 'Book', { available: true });
    }
    return build();
};
exports.defineAbilitiesFor = defineAbilitiesFor;
