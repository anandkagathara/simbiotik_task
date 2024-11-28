import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FilterTopicsDto } from './dto/filter-topic.dto';

describe('TopicsController', () => {
  let controller: TopicsController;
  let service: TopicsService;

  const mockTopic = {
    _id: 'a-topic-id',
    name: 'Fiction',
    description: 'Fiction books',
  };

  const mockTopicsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: mockTopicsService,
        },
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new topic', async () => {
      const createTopicDto: CreateTopicDto = {
        name: 'Fiction',
        description: 'Fiction books',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockTopic);

      const result = await controller.create(createTopicDto);
      expect(result).toEqual(mockTopic);
      expect(service.create).toHaveBeenCalledWith(createTopicDto);
    });
  });

  describe('findAll', () => {
    it('topics with pagination and filters', async () => {
      const paginationQuery: PaginationQueryDto = { skip: 0, limit: 10 };
      const filterDto: FilterTopicsDto = { name: 'Sample' };
  
      jest.spyOn(service, 'findAll').mockResolvedValue([mockTopic]);
  
      const result = await controller.findAll(paginationQuery, filterDto);
      expect(result).toEqual([mockTopic]);
      expect(service.findAll).toHaveBeenCalledWith(paginationQuery, filterDto);
    });
  });
  

  describe('findOne', () => {
    it('should return a single topic', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTopic);

      const result = await controller.findOne('a-topic-id');
      expect(result).toEqual(mockTopic);
      expect(service.findOne).toHaveBeenCalledWith('a-topic-id');
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const updateTopicDto: UpdateTopicDto = {
        description: 'Updated description',
      };

      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockTopic,
        ...updateTopicDto,
      });

      const result = await controller.update('a-topic-id', updateTopicDto);
      expect(result.description).toEqual(updateTopicDto.description);
      expect(service.update).toHaveBeenCalledWith('a-topic-id', updateTopicDto);
    });
  });

  describe('remove', () => {
    it('should delete a topic', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('a-topic-id');
      expect(service.remove).toHaveBeenCalledWith('a-topic-id');
    });
  });
});