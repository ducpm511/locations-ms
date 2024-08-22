import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PaginationDTO } from './dto/paginationDto';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

describe('LocationService', () => {
  let service: LocationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Location>;

  const mockLocationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repository = module.get<Repository<Location>>(getRepositoryToken(Location));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new location', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Lobby',
        parentId: null,
        locationCode: 'A-lobby',
        area: 500,
        building: 'A',
      };
      const savedLocation = { id: 1, ...createLocationDto };

      mockLocationRepository.create.mockReturnValue(createLocationDto);
      mockLocationRepository.save.mockResolvedValue(savedLocation);

      const result = await service.create(createLocationDto);

      expect(result).toEqual(savedLocation);
      expect(mockLocationRepository.create).toHaveBeenCalledWith(
        createLocationDto,
      );
      expect(mockLocationRepository.save).toHaveBeenCalledWith(
        createLocationDto,
      );
    });

    it('should throw NotFoundException if parent location is not found', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Room A',
        parentId: 99,
        locationCode: 'B-roomA',
        area: 300,
        building: 'B',
      };

      mockLocationRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createLocationDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 99 },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const locations = [{ id: 1, name: 'Lobby' }];
      mockLocationRepository.find.mockResolvedValue(locations);

      const paginationDto: PaginationDTO = { skip: 0, limit: 10 };
      const result = await service.findAll(paginationDto);

      expect(result).toEqual(locations);
      expect(mockLocationRepository.find).toHaveBeenCalledWith({
        skip: paginationDto.skip,
        take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        relations: ['parent', 'children'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a location by ID', async () => {
      const location = { id: 1, name: 'Lobby' };
      mockLocationRepository.findOne.mockResolvedValue(location);

      const result = await service.findOne(1);

      expect(result).toEqual(location);
      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['parent', 'children'],
      });
    });

    it('should throw NotFoundException if location is not found', async () => {
      mockLocationRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['parent', 'children'],
      });
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const updateLocationDto: UpdateLocationDto = { name: 'New Lobby' };
      const existingLocation = {
        id: 1,
        name: 'Lobby',
        parentId: null,
        locationCode: 'A-lobby',
        area: 500,
      };
      const updatedLocation = { ...existingLocation, ...updateLocationDto };

      mockLocationRepository.findOne.mockResolvedValue(existingLocation);
      mockLocationRepository.save.mockResolvedValue(updatedLocation);

      await service.update(1, updateLocationDto);

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockLocationRepository.save).toHaveBeenCalledWith(updatedLocation);
    });

    it('should throw NotFoundException if location to update is not found', async () => {
      mockLocationRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Non-existent' })).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('delete', () => {
    it('should delete a location by ID', async () => {
      mockLocationRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);

      expect(mockLocationRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
