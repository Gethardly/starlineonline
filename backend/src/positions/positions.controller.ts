import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req,} from '@nestjs/common';
import {PositionsService} from './positions.service';
import {CreatePositionDto} from './dto/create-position.dto';
import {UpdatePositionDto} from './dto/update-position.dto';
import {Roles} from "../auth/roles.decorator";
import { type AuthenticatedRequest, Role} from "../auth/types";

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {
    }

    @Post()
    create(@Body() createPositionDto: CreatePositionDto, @Req() req: AuthenticatedRequest) {
        const user = req.user;
        if (user) {
            return this.positionsService.create(user, createPositionDto);
        }
    }

    @Get()
    findAll(@Req() req: AuthenticatedRequest, @Query('page') page: string, @Query('pageSize') pageSize: string) {
        const user = req.user;
        if (user) {
            const pageNumber = page ? parseInt(page, 10) : 1;
            const size = pageSize ? parseInt(pageSize, 10) : undefined;
            return this.positionsService.findAll(user, pageNumber, size);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
        const user = req.user;
        if (user) {
            return this.positionsService.findOne(+id, user);
        }
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePositionDto: UpdatePositionDto,
    ) {
        return this.positionsService.update(+id, updatePositionDto);
    }

    @Delete(':id')
    @Roles(Role.admin)
    remove(@Param('id') id: string) {
        return this.positionsService.remove(+id);
    }
}
