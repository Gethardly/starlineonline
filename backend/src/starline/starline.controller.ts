import {BadRequestException, Controller, Get, Param} from '@nestjs/common';
import {StarlineService} from './starline.service';

@Controller('starline')
export class StarlineController {
    constructor(private readonly starlineService: StarlineService) {
    }

    @Get('devices')
    getDevices() {
        return this.starlineService.getDevicesList();
    }

    @Get('device/:id/position')
    getDevicePosition(@Param('id') id: string) {
        if (!id) {
            throw new BadRequestException('id is required');
        } else {
            return this.starlineService.getDevicePosition(id)
        }
    }
}
