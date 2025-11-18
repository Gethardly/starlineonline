import { Controller, Get } from '@nestjs/common';
import { StarlineService } from './starline.service';

@Controller('starline')
export class StarlineController {
  constructor(private readonly starlineService: StarlineService) {}

  @Get('devices')
  getDevices() {
    return this.starlineService.getDevicesList();
  }
}
