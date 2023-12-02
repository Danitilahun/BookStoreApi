import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    return await this.bookModel.find().exec();
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async addBook(bookData: Partial<Book>): Promise<Book> {
    try {
      const newBook = new this.bookModel(bookData);
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
}
