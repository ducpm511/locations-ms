import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/entities/building.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building) private buildingRepo: Repository<Building>,
  ) {}
  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = this.buildingRepo.create(createBuildingDto);
    return this.buildingRepo.save(building);
  }

  async findAll(): Promise<Building[]> {
    return this.buildingRepo.find({ relations: ['locations'] });
  }

  async findOne(id: number): Promise<Building> {
    const building = await this.buildingRepo.findOne({
      where: { id },
      relations: ['locations'],
    });
    if (!building)
      throw new NotFoundException(`Building with ID ${id} not found`);
    return building;
  }

  async update(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<void> {
    const building = await this.buildingRepo.findOne({ where: { id } });
    if (!building)
      throw new NotFoundException(`Building with ID ${id} not found`);

    Object.assign(building, updateBuildingDto);
    await this.buildingRepo.save(building);
  }

  async delete(id: number): Promise<void> {
    const result = await this.buildingRepo.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException(`Building with ID ${id} not found`);
  }
}
