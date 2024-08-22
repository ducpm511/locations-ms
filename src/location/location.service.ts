import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { PaginationDTO } from './dto/paginationDto';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
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
  }

  async findAll(paginationDto: PaginationDTO) {
    return await this.locationRepository.find({
      skip: paginationDto.skip,
      take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
      relations: ['parent', 'children'],
    });
  }

  async findOne(id: number) {
    const location = await this.locationRepository.findOne({
      where: {
        id,
      },
      relations: ['parent', 'children'],
    });
    if (!location) throw new NotFoundException();
    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<void> {
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
  }

  async delete(id: number) {
    return await this.locationRepository.delete({
      id,
    });
  }
}
