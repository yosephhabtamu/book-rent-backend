import { Request, Response } from "express";
import { defineAbilitiesFor } from "../middleware/auth";
import { prisma } from "../app";

export const getBooks = async (req: Request, res: Response) => {
  const { page = 1, size = 10, search = "" } = req.query;

  // Prisma query for pagination and search
  const books = await prisma.bookType.findMany({
    where: {
      title: {
        contains: search as string,
        mode: 'insensitive', // This performs a case-insensitive search
      },
    },
    take: Number(size),
    skip: (Number(page) - 1) * Number(size),
  });

  // Get total count for pagination
  const totalItems = await prisma.bookType.count({
    where: {
      title: {
        contains: search as string,
        mode: 'insensitive',
      },
    },
  });

  res.json({
    totalItems,
    totalPages: Math.ceil(totalItems / Number(size)),
    currentPage: Number(page),
    books,
  });
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await prisma.bookType.create({
      data: req.body,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: "Error creating book", error });
  }
};

export const rentBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ability = defineAbilitiesFor(res.locals?.user);

  // Fetch the book
  const book = await prisma.bookType.findUnique({
    where: { id },
  });

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if(!book.available){
    return res.status(400).json({message:"Book not available"});
  }

  if (ability.can("rent", book)) {
    const user = await prisma.user.findUnique({
      where:{id}
    });
    if(!user) {
      return res.status(404).json({message:"user not found"})
    }
    const updatedBook = await prisma.bookRent.create({
      data: {
        bookId: book.id,
        userId: user.id,
        returnDate: new Date()
      },
    });
    res.json(updatedBook);
  } else {
    res.status(403).json({ message: "You are not allowed to rent this book" });
  }
};

export const getOwnersBooks = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const books = await prisma.bookUser.findMany({
    where: { userId },
    include:{
      book:true
    }
  });
  res.json(books);
};

// Placeholder for changeBookStatus if needed
export const changeBookStatus = async (req: Request, res: Response) => {
  // Implementation needed based on requirements
};
