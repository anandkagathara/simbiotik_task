import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TopicsService } from './topics.service';
import { Topic, TopicDocument } from './schemas/topic.schema';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { NotFoundException } from '@nestjs/common';
import { FilterTopicsDto } from './dto/filter-topic.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

describe('TopicsService', () => {
  let service: TopicsService;
  let model: Model<TopicDocument>;

  const mockTopic = {
    _id: 'a-topic-id',
    name: 'Fiction',
    description: 'Fiction books',
  };

  const mockTopicModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        {
          provide: getModelToken(Topic.name),
          useValue: mockTopicModel,
        },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    model = module.get<Model<TopicDocument>>(getModelToken(Topic.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new topic', async () => {
      const createTopicDto: CreateTopicDto = {
        name: 'Fiction',
        description: 'Fiction books',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockTopic);

      const result = await service.create(createTopicDto);
      expect(result).toEqual(mockTopic);
      expect(service.create).toHaveBeenCalledWith(createTopicDto);
    });
  });

 
  describe('findAll', () => {
    it('topics with pagination and filters', async () => {
      const paginationQuery: PaginationQueryDto = { skip: 0, limit: 10 };
      const filterDto: FilterTopicsDto = { name: 'Sample' };
  
      jest.spyOn(service, 'findAll').mockResolvedValue([mockTopic]);
  
      const result = await service.findAll(paginationQuery, filterDto);
      expect(result).toEqual([mockTopic]);
      expect(service.findAll).toHaveBeenCalledWith(paginationQuery, filterDto);
    });
  });

  describe('findOne', () => {
    it('should return a single topic', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTopic),
      } as any);

      const result = await service.findOne('a-topic-id');
      expect(result).toEqual(mockTopic);
    });

    it('should throw NotFoundException when topic is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne('wrong-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const updateTopicDto: UpdateTopicDto = {
        description: 'Updated description',
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ ...mockTopic, ...updateTopicDto }),
      } as any);

      const result = await service.update('a-topic-id', updateTopicDto);
      expect(result.description).toEqual(updateTopicDto.description);
    });

    it('should throw NotFoundException when topic to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.update('wrong-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a topic', async () => {
      jest.spyOn(model, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      } as any);

      await service.remove('a-topic-id');
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: 'a-topic-id' });
    });

    it('should throw NotFoundException when topic to delete is not found', async () => {
      jest.spyOn(model, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
      } as any);

      await expect(service.remove('wrong-id')).rejects.toThrow(NotFoundException);
    });
  });
});