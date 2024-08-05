"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const bookSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
});
router.get('/', auth_1.authenticate, bookController_1.getBooks);
router.post('/', auth_1.authenticate, (0, validation_1.validateRequest)(bookSchema), bookController_1.createBook);
router.put('/rent/:id', auth_1.authenticate, bookController_1.rentBook);
exports.default = router;
