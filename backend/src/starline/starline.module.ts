import { Module } from '@nestjs/common';
import { StarlineController } from './starline.controller';
import { StarlineService } from './starline.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [StarlineController],
  providers: [StarlineService],
})
export class StarlineModule {}
