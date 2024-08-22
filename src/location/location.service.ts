import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { PaginationDTO } from './dto/paginationDto';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    try {
      const location = this.locationRepository.create(createLocationDto);

      if (createLocationDto.parentId) {
        const parent = await this.locationRepository.findOne({
          where: {
            id: createLocationDto.parentId,
            // building: createLocationDto.building,
          },
        });
        if (!parent) {
          throw new NotFoundException(
            `Parent location with ID ${createLocationDto.parentId} not found`,
          );
        }
        location.parent = parent;
      }

      return this.locationRepository.save(location);
    } catch (error) {
      this.logger.error('Calling create()', error.stack, LocationService.name);
    }
  }

  async findAll(paginationDto: PaginationDTO) {
    try {
      return await this.locationRepository.find({
        skip: paginationDto.skip,
        take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        relations: ['parent', 'children'],
      });
    } catch (error) {
      this.logger.error('Calling findAll()', error.stack, LocationService.name);
    }
  }

  async findOne(id: number) {
    try {
      const location = await this.locationRepository.findOne({
        where: {
          id,
        },
        relations: ['parent', 'children'],
      });
      if (!location) throw new NotFoundException();
      return location;
    } catch (error) {
      this.logger.error('Calling findOne()', error.stack, LocationService.name);
    }
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<void> {
    try {
      const location = await this.locationRepository.findOne({ where: { id } });

      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }

      if (updateLocationDto.parentId) {
        const parent = await this.locationRepository.findOne({
          where: { id: updateLocationDto.parentId },
        });
        if (!parent) {
          throw new NotFoundException(
            `Parent location with ID ${updateLocationDto.parentId} not found`,
          );
        }
        location.parent = parent;
      }

      Object.assign(location, updateLocationDto);

      await this.locationRepository.save(location);
    } catch (error) {
      this.logger.error('Calling update()', error.stack, LocationService.name);
    }
  }

  async delete(id: number) {
    try {
      return await this.locationRepository.delete({
        id,
      });
    } catch (error) {
      this.logger.error('Calling delete()', error.stack, LocationService.name);
    }
  }
}
