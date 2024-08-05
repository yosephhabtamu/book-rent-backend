import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Book, User } from '../models';
import { defineAbilitiesFor } from '../middleware/auth';

export const getBooks = async (req: Request, res: Response) => {
  const { page = 1, size = 10, search = '' } = req.query;

  const books = await Book.findAndCountAll({
    where: {
      title: { [Op.iLike]: `%${search}%` }
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

export const createBook = async (req: Request, res: Response) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

export const rentBook = async (req: Request, res: Response) => {
  const book = await Book.findByPk(req.params.id);
  const ability = defineAbilitiesFor(res.locals?.user);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (ability.can('rent', book)) {
    book.rentedBy = res.locals?.user?.id;
    book.available = false;
    await book.save();
    res.json(book);
  } else {
    res.status(403).json({ message: 'You are not allowed to rent this book' });
  }
};

export const getOwnersBooks = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const books = await Book.findAll({ where: { rentedBy: userId } });
  res.json(books);
};
