import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-position.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
  @IsOptional()
  @IsNumber()
  x: number;

  @IsOptional()
  @IsNumber()
  y: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  contacts: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsNumber()
  positionNumber: number;
}
