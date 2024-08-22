import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  building: string;

  @IsNumber()
  area: number;

  @IsNotEmpty()
  locationCode: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}
