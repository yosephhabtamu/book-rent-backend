import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Ability, AbilityBuilder } from '@casl/ability';
import { findUserById } from '../services/userService';
import { Role } from '../types/roles';



export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const test = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };

    const user  = findUserById(test.id);
    if(!user) return res.status(401).json({message: "unathorized"});
    res.locals.user = user;
    res.locals.role = test.role;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const defineAbilitiesFor = (user: any) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === Role.admin) {
    can('manage', 'all');
  } 
  else if(user.role === Role.owner) {
    can('rent', 'Book');
  }
  else if(user.role === Role.user){

  }

  return build();
};
