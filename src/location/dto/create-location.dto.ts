import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  area: number;

  @IsNotEmpty()
  locationCode: string;

  @IsNotEmpty()
  buildingId: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
