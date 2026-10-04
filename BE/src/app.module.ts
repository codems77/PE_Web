// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseProviders } from './database.provider.js';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';
import { BookRepository } from './book.repository.js';

import { RentalController } from './rental.controller.js';
import { RentalService } from './rental.service.js';
import { RentalRepository } from './rental.repository.js';

import { Book } from './book.entity.js';
import { Category } from './category.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM DB 연결
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),

        entities: [Book, Category],

        // 기존 DB 테이블을 그대로 사용
        synchronize: false,
      }),
    }),

    // BookService에서 @InjectRepository(Book)를 사용할 수 있게 등록
    TypeOrmModule.forFeature([Book, Category]),
  ],

  controllers: [
    AppController,
    BookController,
    RentalController,
  ],

  providers: [
    // 기존 Raw SQL 연결 유지
    ...databaseProviders,

    AppService,

    BookService,
    BookRepository,

    RentalService,
    RentalRepository,
  ],

  exports: [...databaseProviders],
})
export class AppModule {}