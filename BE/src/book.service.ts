// src/book.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookRepository } from './book.repository.js';
import { Book } from './book.entity.js';
import { BookResponseDto } from './book-response.dto.js';

@Injectable()
export class BookService {
  constructor(
    // 기존 Raw SQL 실습에서 사용
    private readonly bookRepository: BookRepository,

    // 이번 ORM 실습에서 사용
    @InjectRepository(Book)
    private readonly ormBookRepository: Repository<Book>,
  ) {}

  // 실습 1: ORM으로 전체 도서 최신순 조회
  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.ormBookRepository.find({
      relations: {
        category: true,
      },
      order: {
        bookId: 'DESC',
      },
    });

    return books.map((book) => new BookResponseDto(book));
  }

  // 기존 도서 등록 기능
  async createBook(body: Record<string, any>): Promise<string> {
    await this.bookRepository.create(body);
    return '도서 등록이 완료되었습니다!';
  }

  // 기존 카테고리별 조회 기능
  async findByCategory(categoryId: number) {
    return this.bookRepository.findByCategory(categoryId);
  }
}