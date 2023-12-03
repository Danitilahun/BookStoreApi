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
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidateObjectIdPipe } from './pipes/validate-objectid.pipe';

@Controller('book')
@UseGuards(AuthGuard())
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    try {
      return await this.bookService.getAllBooks();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async addBook(@Body() bookData: CreateBookDto, @Req() req): Promise<Book> {
    try {
      return await this.bookService.addBook(bookData, req.user);
    } catch (error) {
      if (error instanceof ConflictException) {
        console.log('here in');
        throw new HttpException(
          'Book data already exists.',
          HttpStatus.CONFLICT,
        );
      } else if (error instanceof HttpException) {
        throw error.message;
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async updateBook(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updatedBookData: UpdateBookDto,
  ): Promise<Book> {
    try {
      return await this.bookService.updateBook(id, updatedBookData);
    } catch (error) {
      throw new HttpException(
        'Unable to update book: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteBook(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<Book> {
    try {
      return await this.bookService.deleteBook(id);
    } catch (error) {
      throw new HttpException(
        'Unable to delete book: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getBookById(
    @Param('id', ValidateObjectIdPipe) id: string,
  ): Promise<Book> {
    try {
      return await this.bookService.getBookById(id);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch book: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('author/:authorName')
  async getBooksByAuthor(
    @Param('authorName') authorName: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Book[]> {
    try {
      return await this.bookService.getBooksByAuthor(authorName, page, limit);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books by author: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('price-range')
  async getBooksByPriceRange(
    @Query('min') minPrice: number,
    @Query('max') maxPrice: number,
  ) {
    try {
      return await this.bookService.getBooksByPriceRange(minPrice, maxPrice);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books by price range: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('rating-range')
  async getBooksByRatingRange(
    @Query('min') minRating: number,
    @Query('max') maxRating: number,
  ) {
    try {
      return await this.bookService.getBooksByRatingRange(minRating, maxRating);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books by rating range: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('newest/:limit')
  async getNewestBooks(@Param('limit', ParseIntPipe) limit: number) {
    try {
      return await this.bookService.getNewestBooks(limit);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch newest books: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:category')
  async getBooksByCategory(
    @Param('category') category: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    try {
      return await this.bookService.getBooksByCategory(category, page, limit);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books by category: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('title-search/:titleKeyword')
  async searchBooksByTitle(@Param('titleKeyword') titleKeyword: string) {
    try {
      return await this.bookService.searchBooksByTitle(titleKeyword);
    } catch (error) {
      throw new HttpException(
        'Unable to search books by title: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('rating-above/:rating')
  async getBooksAboveRating(@Param('rating') rating: number) {
    try {
      return await this.bookService.getBooksAboveRating(rating);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books above the specified rating: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('rating-below/:rating')
  async getBooksBelowRating(@Param('rating') rating: number) {
    try {
      return await this.bookService.getBooksBelowRating(rating);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books below the specified rating: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('price-above/:price')
  async getBooksAbovePrice(@Param('price') price: number) {
    try {
      return await this.bookService.getBooksAbovePrice(price);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books above the specified price: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('price-below/:price')
  async getBooksBelowPrice(@Param('price') price: number) {
    try {
      return await this.bookService.getBooksBelowPrice(price);
    } catch (error) {
      throw new HttpException(
        'Unable to fetch books below the specified price: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
