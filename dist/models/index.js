"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Book = exports.User = void 0;
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const book_1 = require("./book");
Object.defineProperty(exports, "Book", { enumerable: true, get: function () { return book_1.Book; } });
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
user_1.User.hasMany(book_1.Book, { foreignKey: 'rentedBy' });
book_1.Book.belongsTo(user_1.User, { foreignKey: 'rentedBy', as: 'Renter' });
