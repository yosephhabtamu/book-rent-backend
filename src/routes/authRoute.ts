import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';
import { loginSchema, registerSchema } from '../validationSchemas/authSchema';

const router = Router();



router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;
