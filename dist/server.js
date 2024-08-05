"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const models_1 = require("./models");
const PORT = process.env.PORT || 9999;
models_1.sequelize.sync({ force: false }).then(() => {
    console.log('Database connected');
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
