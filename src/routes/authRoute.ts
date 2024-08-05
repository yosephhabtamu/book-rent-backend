import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

const authSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

router.post('/register', validateRequest(authSchema), register);
router.post('/login', validateRequest(authSchema), login);

export default router;
