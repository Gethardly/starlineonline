import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PrismaService} from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {
    }

    create(createUserDto: CreateUserDto) {
        try {
            return this.prisma.user.create({
                data: createUserDto,
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new BadRequestException('Пользователь с таким email уже существует');
            }
            throw e;
        }
    }


    findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                // password
            },
        });
    }

    findOne(id
            :
            number
    ) {
        return this.prisma.user.findFirst({
            where: {id},
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                // password
            },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.prisma.user.update({
            where: {id},
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                // password
            },
        });
    }

    remove(id
           :
           number
    ) {
        return this.prisma.user.delete({where: {id}});
    }
}
