import { IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsString()
  name: string;
}
