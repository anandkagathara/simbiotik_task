import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import{ TopicsService }from './topics.service';
import{CreateTopicDto} from './dto/create-topic.dto';
import { UpdateTopicDto} from './dto/update-topic.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FilterTopicsDto } from './dto/filter-topic.dto';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'created successfuly' })
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }


  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'deleted success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'not found' })
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'get all topics' })
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filterDto: FilterTopicsDto,

  ) {
    return this.topicsService.findAll(paginationQuery,filterDto);
  }

  @Get(':id')
  @ApiResponse({status: HttpStatus.OK, description: 'get topic based on id' })
  @ApiResponse({ status:HttpStatus.NOT_FOUND, description: ' not found' })
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({status:HttpStatus.OK, description: 'updated success' })
  @ApiResponse({status:HttpStatus.NOT_FOUND, description: ' not found' })
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

}