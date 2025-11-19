import { Module } from '@nestjs/common';
import { PositionHistoryService } from './position-history.service';
import { PositionHistoryController } from './position-history.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PositionHistoryController],
  providers: [PositionHistoryService, PrismaService],
})
export class PositionHistoryModule {}
