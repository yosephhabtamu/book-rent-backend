"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnersBooks = exports.rentBook = exports.createBook = exports.getBooks = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const getBooks = async (req, res) => {
    const { page = 1, size = 10, search = '' } = req.query;
    const books = await models_1.Book.findAndCountAll({
        where: {
            title: { [sequelize_1.Op.iLike]: `%${search}%` }
        },
        limit: Number(size),
        offset: (Number(page) - 1) * Number(size),
    });
    res.json({
        totalItems: books.count,
        totalPages: Math.ceil(books.count / Number(size)),
        currentPage: Number(page),
        books: books.rows,
    });
};
exports.getBooks = getBooks;
const createBook = async (req, res) => {
    const book = await models_1.Book.create(req.body);
    res.status(201).json(book);
};
exports.createBook = createBook;
const rentBook = async (req, res) => {
    const book = await models_1.Book.findByPk(req.params.id);
    const ability = (0, auth_1.defineAbilitiesFor)(req.user);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    if (ability.can('rent', book)) {
        book.rentedBy = req.user?.id;
        book.available = false;
        await book.save();
        res.json(book);
    }
    else {
        res.status(403).json({ message: 'You are not allowed to rent this book' });
    }
};
exports.rentBook = rentBook;
const getOwnersBooks = async (req, res) => {
    const userId = req.params.userId;
    const books = await models_1.Book.findAll({ where: { rentedBy: userId } });
    res.json(books);
};
exports.getOwnersBooks = getOwnersBooks;
