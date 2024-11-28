import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { Book } from './schemas/book.schema';
import { Topic } from 'src/topics/schemas/topic.schema';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

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

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByTopic: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const result = await controller.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('books with pagination and filters', async () => {
      const paginationQuery: PaginationQueryDto = { skip: 0, limit: 10 };
      const filterDto: FilterBooksDto = { title: 'Test' };

      jest.spyOn(service, 'findAll').mockResolvedValue([mockBook]);

      const result = await controller.findAll(paginationQuery, filterDto);
      expect(result).toEqual([mockBook]);
      expect(service.findAll).toHaveBeenCalledWith(paginationQuery, filterDto);
    });
  });

  describe('findOne', () => {
    it('get a single book', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);

      const result = await controller.findOne('a-book-id');
      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith('a-book-id');
    });
  });

  describe('update', () => {
    it('update a book', async () => {
      const updateBookDto = {
        title: 'Updated Book',
      };
  
      // Merge `updateBookDto` into `mockBook`, ensuring `topics` remains `Topic[]`
      const updatedMockBook = {
        ...mockBook,
        ...updateBookDto,
        topics: mockBook.topics, // Ensures no `string[]` assignment
      };
  
      jest.spyOn(service, 'update').mockResolvedValue(updatedMockBook);
  
      const result = await controller.update('a-book-id', updateBookDto);
      expect(result).toEqual(updatedMockBook);
      expect(service.update).toHaveBeenCalledWith('a-book-id', updateBookDto);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('a-book-id');
      expect(service.remove).toHaveBeenCalledWith('a-book-id');
    });
  });

  describe('findByTopic', () => {
    it('books by topic with pagination', async () => {
      const paginationQuery: PaginationQueryDto = { skip: 0, limit: 10 };

      jest.spyOn(service, 'findByTopic').mockResolvedValue([mockBook]);

      const result = await controller.findByTopic('topic-id', paginationQuery);
      expect(result).toEqual([mockBook]);
      expect(service.findByTopic).toHaveBeenCalledWith('topic-id', paginationQuery);
    });
  });
});
