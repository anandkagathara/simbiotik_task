import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BooksService } from './books.service';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { Topic } from 'src/topics/schemas/topic.schema';

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<BookDocument>;


  const mockTopic: Topic = {
    // _id: 'topic-id',
    name: 'Sample Topic',
  };
  
  const mockBook: Book = {
    // _id: 'a-book-id',
    title: 'Typescript',
    author: 'Author',
    isbn: '1234567890',
    topics: [mockTopic],
    publishedDate: new Date('2024-11-28'),
  };
  const mockBookModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    populate: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
    where: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<BookDocument>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Typescript',
        author: 'Author',
        isbn: '1234567890',
        topics: ['topic-id'],
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(createBookDto);
    });
  });


  describe('findAll', () => {
    it('should return an array of books with pagination and filters', async () => {
      const paginationQuery: PaginationQueryDto = { skip: 0, limit: 10 };
      const filterDto: FilterBooksDto = { title: 'Test' };

      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBook]),
      };

      jest.spyOn(model, 'find').mockReturnValue(mockFind as any);

      const result = await service.findAll(paginationQuery, filterDto);
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const mockPopulate = {
        exec: jest.fn().mockResolvedValue(mockBook),
      };

      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue(mockPopulate),
      } as any);

      const result = await service.findOne('a-book-id');
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when book is not found', async () => {
      const mockPopulate = {
        exec: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue(mockPopulate),
      } as any);

      await expect(service.findOne('wrong-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByTopic', () => {
    it('should return books by topic with pagination', async () => {
      const paginationQuery: PaginationQueryDto = { skip: 0, limit: 10 };
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBook]),
      };

      jest.spyOn(model, 'find').mockReturnValue(mockFind as any);

      const result = await service.findByTopic('topic-id', paginationQuery);
      expect(result).toEqual([mockBook]);
    });
  });
});