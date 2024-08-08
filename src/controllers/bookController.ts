import { Request, Response } from "express";
import { defineAbilitiesFor } from "../middleware/auth";
import { prisma } from "../app";
import { BookStatus } from "../types/bookStatus";
import { findUserById } from "../services/userService";

export const getBooks = async (req: Request, res: Response) => {
  const {
    page = 1,
    size = 10,
    title = "",
    author = "",
    ownerName = "",
    ownerId = "",
    category = "",
    status = "",
  } = req.query;

  const bookFilter: any = {};
  const userFilter: any = {};

  if (ownerName)
    userFilter["fullName"] = {
      contains: ownerName as string,
      mode: "insensitive",
    };
  if (ownerId) userFilter["id"] = ownerId as string;

  if (title)
    bookFilter["title"] = {
      contains: title as string,
      mode: "insensitive",
    };

  if (author)
    bookFilter["author"] = {
      contains: author as string,
      mode: "insensitive",
    };

  if (category)
    bookFilter["category"] = {
      is: {
        name: {
          contains: category as string,
          mode: "insensitive",
        },
      },
    };

  if (status) {
    try {
      bookFilter["status"] = BookStatus[status as keyof typeof BookStatus];
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "error parsing status enum" });
    }
  }

  const books = await prisma.bookUser.findMany({
    include: {
      book: {
        include: {
          category: true,
        },
      },
      user: true,
    },
    where: {
      book: bookFilter,
      user: userFilter,
    },
    take: Number(size),
    skip: (Number(page) - 1) * Number(size),
  });

  // Get total count for pagination
  const totalItems = await prisma.bookType.count({
    where: {
      title: {
        contains: title as string,
        mode: "insensitive",
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
    const user = await res.locals.user;
    const { categoryId, title, author, quantity, price } = req.body;
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category)
      return res.status(404).json({ message: "Book category not found" });
    const existingBook = await prisma.bookType.findFirst({
      where: {
        title,
        author,
      },
    });
    if (existingBook) {
      await prisma.bookType.update({
        where: {
          id: existingBook.id,
        },
        data: {
          owners: {
            create: {
              quantity,
              price,
              user: {
                connect: { id: user.id},
              },
              bookRents:{}
            },
          },
        },
      });
      return res
        .status(200)
        .json({ message: "Registered to already existing book sucessfully" });
    }
    const book = await prisma.bookType.create({
      data: {
        title,
        author,
        category: {
          connect: { id: category.id },
        },
        owners: {
          create: {
            quantity,
            price,
            user: {
              connect: { id: user.Id, email: user.email },
            },
          },
        },
      },
    });
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating book", error });
  }
};

export const rentBook = async (req: Request, res: Response) => {
  const { bookId, ownerId, amount = 1 } = req.body;
  const user = await res.locals.user;
  const ability = defineAbilitiesFor(user);


  const bookOwner = await findUserById(ownerId);
  if(!bookOwner) return res.status(404).json({message:"selected book owner not found"});
  // Fetch the book
  const book = await prisma.bookType.findUnique({
    where: { id: bookId },
  });
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const bookAvailable = await prisma.bookUser.findFirst({
    where: {
      book: {
        id: bookId,
      },
      user:{
        id:bookOwner.id
      },
      quantity: {
        gte: amount,
      },
    },
  });

  if (!book.available || bookAvailable === null) {
    return res.status(400).json({ message: "Book not available" });
  }
  if (ability.can("rent", book)) {
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const [_,rent] = await prisma.$transaction([
      prisma.bookUser.update({
        where:{
          id:bookAvailable.id
        },
        data:{
          quantity: bookAvailable.quantity - amount
        }
      }),
    prisma.bookRent.create({
      data: {
       book:{
        connect:{ id: book.id}
       },
        user:{
          connect:{id: user.id}
        },
        BookUser:{
          connect:{
            id: bookAvailable.id,
          }
        },
        returnDate: new Date(),
      },
    })
  ]);
    res.json(rent);
  } else {
    res.status(403).json({ message: "You are not allowed to rent this book" });
  }
};

export const changeBookStatus = async (req: Request, res: Response) => {
  // Implementation needed based on requirements
};
