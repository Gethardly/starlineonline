import { Injectable } from '@nestjs/common';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PositionHistoryService {
  constructor(private prismaService: PrismaService) {}

  create(createPositionHistoryDto: CreatePositionHistoryDto) {
    return this.prismaService.deviceHistory.create({
      data: createPositionHistoryDto,
    });
  }

  findAll() {
    return `This action returns all positionHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} positionHistory`;
  }

  update(id: number, updatePositionHistoryDto: UpdatePositionHistoryDto) {
    return `This action updates a #${id} positionHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} positionHistory`;
  }
}
