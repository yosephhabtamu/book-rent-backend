"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const authSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6),
});
router.post('/register', (0, validation_1.validateRequest)(authSchema), authController_1.register);
router.post('/login', (0, validation_1.validateRequest)(authSchema), authController_1.login);
exports.default = router;
