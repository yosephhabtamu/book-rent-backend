import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../app";

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { location, fullName, email, phoneNumber, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if email is already in use
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Create a new user
  const user = await prisma.user.create({
    data: {
      email,
      location,
      fullName,
      phoneNumber,
      password: hashedPassword,
      role,
    },
  });

  res.status(201).json(user);
};

// Login a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Set expiration time for the token
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// Get users with pagination and filtering
export const getUsers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      size = 10,
      search = "",
      location = "",
      status = "",
    } = req.query;

    // Build query filters
    const queryFilters: any = {
      AND: [],
    };

    if (search) {
      queryFilters.AND.push({
        fullName: {
          contains: search,
          mode: 'insensitive',
        },
      });
    }

    if (location) {
      queryFilters.AND.push({
        location: {
          contains: location,
          mode: 'insensitive',
        },
      });
    }

    if (status) {
      queryFilters.AND.push({
        status,
      });
    }

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where: queryFilters,
      take: Number(size),
      skip: (Number(page) - 1) * Number(size),
    });

    // Get total count for pagination
    const totalItems = await prisma.user.count({
      where: queryFilters,
    });

    res.json({
      totalItems,
      totalPages: Math.ceil(totalItems / Number(size)),
      currentPage: Number(page),
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "An error occurred while fetching the user." });
  }
};

// Change user status (e.g., activate/deactivate)
export const changeUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Toggle user's status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "An error occurred while updating the user status." });
  }
};
