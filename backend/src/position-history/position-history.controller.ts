import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionHistoryService } from './position-history.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';

@Controller('position-history')
export class PositionHistoryController {
  constructor(private readonly positionHistoryService: PositionHistoryService) {}

  @Post()
  create(@Body() createPositionHistoryDto: CreatePositionHistoryDto) {
    return this.positionHistoryService.create(createPositionHistoryDto);
  }

  @Get()
  findAll() {
    return this.positionHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePositionHistoryDto: UpdatePositionHistoryDto) {
    return this.positionHistoryService.update(+id, updatePositionHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionHistoryService.remove(+id);
  }
}
