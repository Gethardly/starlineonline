import { Module } from '@nestjs/common';
import { StarlineController } from './starline.controller';
import { StarlineService } from './starline.service';
import { HttpModule } from '@nestjs/axios';
import {DevicesService} from "../devices/devices.service";
import {PrismaService} from "../../prisma/prisma.service";

@Module({
  imports: [HttpModule],
  controllers: [StarlineController],
  providers: [StarlineService, DevicesService, PrismaService],
})
export class StarlineModule {}
