import { IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  contacts: string;

  @IsString()
  description: string;

  @IsString()
  note: string;
}
