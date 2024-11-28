import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import{ BooksService } from './books.service';
import{ CreateBookDto }from './dto/create-book.dto';
import { UpdateBookDto }from './dto/update-book.dto';
import { FilterBooksDto }from './dto/filter-books.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'created successfully' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'get books' })
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filterDto: FilterBooksDto,
  ) {
    return this.booksService.findAll(paginationQuery, filterDto);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'get book based on ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: ' not found' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }



  @Get('topic/:topicId')
  @ApiResponse({ status: HttpStatus.OK, description: 'get books with topic' })
  findByTopic(
    @Param('topicId') topicId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.booksService.findByTopic(topicId, paginationQuery);
  }
}