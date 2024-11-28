import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.bookModel.findOne({ isbn: createBookDto.isbn }).exec();
    console.log("BooksService ~ create ~ existingBook:", existingBook)
    if (existingBook) {
      throw new ConflictException('This ISBN already exists');
    }

    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }
  
  async findAll(paginationQuery: PaginationQueryDto, filterDto: FilterBooksDto): Promise<Book[]> {
    const { skip, limit } = paginationQuery;
    const query = this.bookModel.find();

    if (filterDto.title) {
      query.where('title', new RegExp(filterDto.title, 'i'));
    }

    if (filterDto.author) {
      query.where('author', new RegExp(filterDto.author, 'i'));
    }

    if (filterDto.topics?.length) {
      query.where('topics', { $in: filterDto.topics });
    }

    return query
      .populate('topics')
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`booking not fund with this ID`);
    }
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('topics').exec();
    if (!book) {
      throw new NotFoundException(`booking not found with this ID`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .populate('topics')
      .exec();
    if (!updatedBook) {
      throw new NotFoundException(`booking not found with this ID`);
    }
    return updatedBook;
  }

 

  async findByTopic(topicId: string, paginationQuery: PaginationQueryDto): Promise<Book[]> {
    const { skip, limit } = paginationQuery;
    return this.bookModel
      .find({ topics: topicId })
      .populate('topics')
      .skip(skip)
      .limit(limit)
      .exec();
  }
}