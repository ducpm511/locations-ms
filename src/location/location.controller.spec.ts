import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PaginationDTO } from './dto/paginationDto';

describe('LocationController', () => {
  let controller: LocationController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: LocationService;

  const mockLocationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call LocationService.create with the correct arguments', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Lobby',
        locationCode: 'A-lobby',
        parentId: null,
        area: 500,
        building: 'A',
      };
      const result = { id: 1, ...createLocationDto };

      mockLocationService.create.mockResolvedValue(result);

      const response = await controller.create(createLocationDto);

      expect(response).toEqual(result);
      expect(mockLocationService.create).toHaveBeenCalledWith(
        createLocationDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call LocationService.findAll with the correct arguments', async () => {
      const paginationDto: PaginationDTO = { skip: 0, limit: 10 };
      const result = [{ id: 1, name: 'Lobby', locationCode: 'A-lobby' }];

      mockLocationService.findAll.mockResolvedValue(result);

      const response = await controller.findAll(paginationDto);

      expect(response).toEqual(result);
      expect(mockLocationService.findAll).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findOne', () => {
    it('should call LocationService.findOne with the correct arguments', async () => {
      const result = { id: 1, name: 'Lobby', locationCode: 'A-lobby' };

      mockLocationService.findOne.mockResolvedValue(result);

      const response = await controller.findOne(1);

      expect(response).toEqual(result);
      expect(mockLocationService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call LocationService.update with the correct arguments', async () => {
      const updateLocationDto: UpdateLocationDto = { name: 'Updated Lobby' };

      mockLocationService.update.mockResolvedValue(undefined); // since update returns void

      const response = await controller.update(1, updateLocationDto);

      expect(response).toBeUndefined();
      expect(mockLocationService.update).toHaveBeenCalledWith(
        1,
        updateLocationDto,
      );
    });
  });

  describe('remove', () => {
    it('should call LocationService.delete with the correct arguments', async () => {
      mockLocationService.delete.mockResolvedValue(undefined); // since delete returns void

      const response = await controller.remove(1);

      expect(response).toBeUndefined();
      expect(mockLocationService.delete).toHaveBeenCalledWith(1);
    });
  });
});
