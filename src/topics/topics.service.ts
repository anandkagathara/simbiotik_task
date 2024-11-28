import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './schemas/topic.schema';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FilterTopicsDto } from './dto/filter-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const existingTopic = await this.topicModel.findOne({ name: createTopicDto.name });
    if (existingTopic) {
      throw new ConflictException(`topic name is already exists.`);
    }
    const createdTopic = new this.topicModel(createTopicDto);
    return createdTopic.save();
  }
  

  async remove(id: string): Promise<void> {
    const result = await this.topicModel.deleteOne({ _id: id }).exec();
    console.log("remove ~ result:", result)
    if (result.deletedCount === 0) {
      throw new NotFoundException(`topic not found with this ID`);
    }
  }

  async findAll(
    paginationQuery: PaginationQueryDto,filterDto
  ): Promise<Topic[]> {
    const { skip, limit } = paginationQuery;
    const query = this.topicModel.find();
  
    if (filterDto.name) {
      query.where('name', new RegExp(filterDto.name, 'i'));
    }


    return query
      .skip(skip)
      .limit(limit)
      .exec();
  }
  
  

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException(`topic not found with this ID`);
    }
    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const updatedTopic = await this.topicModel
      .findByIdAndUpdate(id, updateTopicDto, { new: true })
      .exec();
    if (!updatedTopic) {
      throw new NotFoundException(`topic not found with this ID`);
    }
    return updatedTopic;
  }


}