import { IsNotEmpty } from 'class-validator';

export class CreateBuildingDto {
  @IsNotEmpty()
  name: string;
}
