import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface BookAttributes {
  id?:string;
  title: string;
  author: string;
  available: boolean;
  rentedBy?: string;
  bookCover: string;
}

export class Book extends Model<BookAttributes> implements BookAttributes {
  public id?: string ;
  public title: string = "";
  public author: string = "";
  public available: boolean = true;
  public rentedBy?: string = "";
  public bookCover: string = "";
}

Book.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    bookCover: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rentedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Book',
  }
);
