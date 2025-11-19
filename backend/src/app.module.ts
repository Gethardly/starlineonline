import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PositionsModule } from './positions/positions.module';
import { StarlineModule } from './starline/starline.module';
import { PositionHistoryModule } from './position-history/position-history.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [AuthModule, PositionsModule, StarlineModule, PositionHistoryModule, DevicesModule],
  providers: [PrismaService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
