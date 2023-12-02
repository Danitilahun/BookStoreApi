import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return await this.bookService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    return await this.bookService.getBookById(id);
  }

  @Post()
  async addBook(@Body() bookData: Partial<Book>): Promise<Book> {
    try {
      return await this.bookService.addBook(bookData);
    } catch (error) {
      //   console.log(error, error.message);
      if (error instanceof ConflictException) {
        console.log('here in');
        throw new HttpException(
          'Book data already exists.',
          HttpStatus.CONFLICT,
        );
      } else if (error instanceof HttpException) {
        throw error.message;
      } else {
        console.log('here');
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updatedBookData: Partial<Book>,
  ): Promise<Book> {
    return await this.bookService.updateBook(id, updatedBookData);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<Book> {
    return await this.bookService.deleteBook(id);
  }
}
