import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id?: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id?: string ;
  public username: string = '';
  public password: string = '';
  public role: 'admin' | 'user' = 'user';
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);
