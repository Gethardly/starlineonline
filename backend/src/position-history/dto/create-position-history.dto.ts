import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePositionHistoryDto {
  @IsString()
  deviceId: string;

  @IsNumber()
  positionId: number;

  @IsOptional()
  @IsDate()
  arrivedAt: Date;

  @IsOptional()
  @IsDate()
  leftAt: Date;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  createdBy: string;
}
