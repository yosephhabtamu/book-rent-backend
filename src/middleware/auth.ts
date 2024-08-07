import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Ability, AbilityBuilder } from '@casl/ability';



export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    res.locals.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const defineAbilitiesFor = (user: any) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    can('manage', 'all');
  } 
  else {
    can('read', 'Book');
    can('rent', 'Book', { available: true });
  }

  return build();
};
