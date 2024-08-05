import { Router } from 'express';
import { getBooks, createBook, rentBook } from '../controllers/bookController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
});

router.get('/', authenticate, getBooks);
router.post('/', authenticate, validateRequest(bookSchema), createBook);
router.put('/rent/:id', authenticate, rentBook);

export default router;
