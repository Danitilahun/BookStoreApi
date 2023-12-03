import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    try {
      return await this.bookModel.find().exec();
    } catch (error) {
      throw new Error('Unable to fetch books: ' + error.message);
    }
  }

  async getBookById(id: string): Promise<Book> {
    try {
      const book = await this.bookModel.findById(id).exec();
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return book;
    } catch (error) {
      throw new Error('Unable to fetch books: ' + error.message);
    }
  }

  async addBook(bookData: Partial<Book>, user: User): Promise<Book> {
    try {
      const data = Object.assign(bookData, { user: user._id });
      const newBook = new this.bookModel(data);
      return await newBook.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Book data already exists.');
      }
      throw error;
    }
  }

  async updateBook(id: string, updatedBookData: Partial<Book>): Promise<Book> {
    const existingBook = await this.bookModel
      .findByIdAndUpdate(id, updatedBookData, { new: true })
      .exec();
    if (!existingBook) {
      throw new NotFoundException('Book not found');
    }
    return existingBook;
  }

  async deleteBook(id: string): Promise<Book> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
    if (!deletedBook) {
      throw new NotFoundException('Book not found');
    }
    return deletedBook as unknown as Book;
  }

  async getBooksByAuthor(
    authorName: string,
    page = 1,
    limit = 3,
  ): Promise<Book[]> {
    try {
      const query = { author: { $regex: authorName, $options: 'i' } };
      const skipCount = (page - 1) * limit;

      const books = await this.bookModel
        .find(query)
        .skip(skipCount)
        .limit(limit)
        .exec();

      return books;
    } catch (error) {
      throw new Error('Unable to fetch books by author: ' + error.message);
    }
  }

  async getBooksByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Book[]> {
    try {
      return await this.bookModel
        .find({ price: { $gte: minPrice, $lte: maxPrice } })
        .exec();
    } catch (error) {
      throw new Error('Unable to fetch books by price range: ' + error.message);
    }
  }

  async getBooksByRatingRange(
    minRating: number,
    maxRating: number,
  ): Promise<Book[]> {
    try {
      return await this.bookModel
        .find({ rating: { $gte: minRating, $lte: maxRating } })
        .exec();
    } catch (error) {
      throw new Error(
        'Unable to fetch books by rating range: ' + error.message,
      );
    }
  }

  async getNewestBooks(limit: number): Promise<Book[]> {
    try {
      return await this.bookModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error('Unable to fetch newest books: ' + error.message);
    }
  }

  async getBooksByCategory(
    category: string,
    page = 1,
    limit = 3,
  ): Promise<Book[]> {
    try {
      const query = { category: { $regex: category, $options: 'i' } };
      const skipCount = (page - 1) * limit;

      return await this.bookModel
        .find(query)
        .skip(skipCount)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new Error('Unable to fetch books by category: ' + error.message);
    }
  }

  async searchBooksByTitle(titleKeyword: string): Promise<Book[]> {
    try {
      return await this.bookModel
        .find({ title: { $regex: titleKeyword, $options: 'i' } })
        .exec();
    } catch (error) {
      throw new Error('Unable to search books by title: ' + error.message);
    }
  }

  async getBooksAboveRating(rating: number): Promise<Book[]> {
    try {
      return await this.bookModel.find({ rating: { $gte: rating } }).exec();
    } catch (error) {
      throw new Error(
        'Unable to fetch books above the specified rating: ' + error.message,
      );
    }
  }

  async getBooksBelowRating(rating: number): Promise<Book[]> {
    try {
      return await this.bookModel.find({ rating: { $lte: rating } }).exec();
    } catch (error) {
      throw new Error(
        'Unable to fetch books below the specified rating: ' + error.message,
      );
    }
  }

  async getBooksAbovePrice(price: number): Promise<Book[]> {
    try {
      return await this.bookModel.find({ price: { $gte: price } }).exec();
    } catch (error) {
      throw new Error(
        'Unable to fetch books above the specified price: ' + error.message,
      );
    }
  }

  async getBooksBelowPrice(price: number): Promise<Book[]> {
    try {
      return await this.bookModel.find({ price: { $lte: price } }).exec();
    } catch (error) {
      throw new Error(
        'Unable to fetch books below the specified price: ' + error.message,
      );
    }
  }
}
