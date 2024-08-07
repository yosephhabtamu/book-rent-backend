import { Router } from 'express';
import { getBooks, createBook, rentBook, changeBookStatus } from '../controllers/bookController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';
import { bookSchema, bookStatusSchema } from '../validationSchemas/bookSchema';

const router = Router();



router.get('/',  getBooks);
router.post('/',  validateRequest(bookSchema), createBook);
router.put('/rent/:id',  rentBook);
router.put('/status', validateRequest(bookStatusSchema),changeBookStatus);

export default router;
