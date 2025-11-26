import { IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  deviceId: string;

  @IsOptional()
  @IsString()
  imei?: string;

  @IsString()
  alias: string;
}
