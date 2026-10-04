// src/book.controller.ts

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service.js';
import { BookResponseDto } from './book-response.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // ORM으로 전체 도서 최신순 조회
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return this.bookService.getAllBooks();
  }

  // 기존 도서 등록
  @Post()
  async createBook(
    @Body() body: Record<string, any>,
  ): Promise<string> {
    return this.bookService.createBook(body);
  }

  // 기존 카테고리별 도서 조회
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
  ) {
    return this.bookService.findByCategory(Number(categoryId));
  }
}