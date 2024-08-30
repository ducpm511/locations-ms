import {
  BadRequestException,
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
import { Building } from 'src/entities/building.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    try {
      const building = await this.buildingRepository.findOne({
        where: { id: createLocationDto.buildingId },
      });
      if (!building) {
        throw new NotFoundException(
          `Building with ID ${createLocationDto.buildingId} not found`,
        );
      }

      const location = this.locationRepository.create({
        ...createLocationDto,
        building,
      });

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
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<void> {
    try {
      const location = await this.locationRepository.findOne({
        where: { id },
        relations: ['parent', 'children'],
      });

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

        // Check if the new parent is a descendant of the current location
        const descendants = await this.getDescendants(location.id);
        if (
          descendants.some(
            (descendant) => descendant.id === updateLocationDto.parentId,
          )
        ) {
          throw new BadRequestException(
            'Invalid parentId: A location cannot be a child of its own child or descendant.',
          );
        }

        location.parent = parent;
      }

      if (updateLocationDto.buildingId) {
        const building = await this.buildingRepository.findOne({
          where: { id: updateLocationDto.buildingId },
        });
        if (!building) {
          throw new NotFoundException(
            `Building with ID ${updateLocationDto.buildingId} not found`,
          );
        }
        location.building = building;
      }

      Object.assign(location, updateLocationDto);

      await this.locationRepository.save(location);
    } catch (error) {
      this.logger.error('Calling update()', error.stack, LocationService.name);
      throw error;
    }
  }

  private async getDescendants(locationId: number): Promise<Location[]> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['children'],
    });

    if (!location || !location.children || location.children.length === 0) {
      return [];
    }

    let descendants = [...location.children];

    for (const child of location.children) {
      const childDescendants = await this.getDescendants(child.id);
      descendants = descendants.concat(childDescendants);
    }

    return descendants;
  }

  async delete(id: number) {
    try {
      return await this.locationRepository.delete({
        id,
      });
    } catch (error) {
      this.logger.error('Calling delete()', error.stack, LocationService.name);
      throw error;
    }
  }
}
