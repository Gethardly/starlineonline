import {Injectable} from '@nestjs/common';
import {CreatePositionDto} from './dto/create-position.dto';
import {UpdatePositionDto} from './dto/update-position.dto';
import {PrismaService} from '../../prisma/prisma.service';
import {Role, User} from "../auth/types";

@Injectable()
export class PositionsService {
    constructor(private prisma: PrismaService) {
    }

    create(user: User, createPositionDto: CreatePositionDto) {
        const data: any = { ...createPositionDto };

        if (user.role !== Role.admin) {
            data.users = { connect: { id: user.userId } };
        }

        return this.prisma.position.create({
            data,
            include: { users: true },
        });
    }


    findAll(user: User) {
        const where = user.role === Role.admin
            ? undefined // для админа нет выборки, иначе только опр пользователя позиции
            : {
                users: {
                    some: {id: user.userId},
                },
            };

        return this.prisma.position.findMany({
            where,
            include: {users: true},
        });
    }

    findOne(id: number, user: User) {
        if (user.role === Role.admin) {
            return this.prisma.position.findUnique({
                where: { id },
                include: { users: true },
            });
        }

        return this.prisma.position.findFirst({
            where: {
                id,
                users: { some: { id: user.userId } },
            },
            include: { users: true },
        });
    }

    update(id: number, updatePositionDto: UpdatePositionDto) {
        return this.prisma.position.update({
            where: {id},
            data: updatePositionDto,
        });
    }

    remove(id: number) {
        return this.prisma.position.delete({where: {id}});
    }
}
