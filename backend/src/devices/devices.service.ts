import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prismaService: PrismaService) {}

  async create(createDeviceDto: CreateDeviceDto) {
    try {
      return await this.prismaService.device.create({
        data: createDeviceDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0] || 'deviceId';

        const messages: Record<string, string> = {
          deviceId: 'Устройство с таким deviceId уже существует',
          imei: 'Устройство с таким IMEI уже зарегистрировано',
        };

        throw new ConflictException(
          messages[field] || 'Такое устройство уже существует',
        );
      }

      console.error('Prisma error:', error);
      throw new InternalServerErrorException(
        'Ошибка при добавлении устройства',
      );
    }
  }

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
