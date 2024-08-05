import { User } from './user';
import { Book } from './book';
import sequelize from '../config/database';

User.hasMany(Book, { foreignKey: 'rentedBy' });
Book.belongsTo(User, { foreignKey: 'rentedBy', as: 'Renter' });

export { User, Book, sequelize };
