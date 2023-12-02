import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum Category {
  FICTION = 'Fiction',
  NON_FICTION = 'Non-Fiction',
  MYSTERY = 'Mystery',
  SCIENCE_FICTION = 'Science Fiction',
  FANTASY = 'Fantasy',
  ROMANCE = 'Romance',
  HORROR = 'Horror',
  HISTORY = 'History',
  BIOGRAPHY = 'Biography',
  SELF_HELP = 'Self-Help',
  TRAVEL = 'Travel',
  CHILDRENS = "Children's",
  COOKING = 'Cooking',
  POETRY = 'Poetry',
  PSYCHOLOGY = 'Psychology',
  BUSINESS = 'Business',
  ART = 'Art',
  HEALTH = 'Health',
  TECHNOLOGY = 'Technology',
  SPORTS = 'Sports',
  OTHER = 'Other',
}
const validatePrice = (value: any) => {
  if (typeof value !== 'number') {
    throw new mongoose.Error('Price should be a number');
  }
};

const validateRating = (value: any) => {
  if (typeof value !== 'number' || value < 0 || value > 5) {
    throw new mongoose.Error('Rating should be a number between 0 and 5');
  }
};

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: [true, 'Title is required'], type: String })
  title: string;

  @Prop({ required: [true, 'Description is required'], type: String })
  description: string;

  @Prop({ required: [true, 'Author is required'], type: String })
  author: string;

  @Prop({
    required: [true, 'Price is required'],
    min: [0, 'Price must be at least 0'],
    validate: [validatePrice, 'Price should be a number'],
    type: Number,
  })
  price: number;

  @Prop({
    required: [true, 'Rating is required'],
    validate: [validateRating, 'Rating should be a number between 0 and 5'],
    type: Number,
  })
  rating: number;

  @Prop({
    required: [true, 'Category is required'],
    enum: { values: Object.values(Category), message: 'Invalid category' },
    type: String,
  })
  category: Category;
}

export const BookSchema = SchemaFactory.createForClass(Book);
BookSchema.index({ title: 1, author: 1 }, { unique: true });
