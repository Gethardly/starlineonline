import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import {CreateDeviceDto} from './dto/create-device.dto';
import {UpdateDeviceDto} from './dto/update-device.dto';
import {PrismaService} from '../../prisma/prisma.service';
import {Device} from "../starline/starline.types";

@Injectable()
export class DevicesService {
    constructor(private prismaService: PrismaService) {
    }

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

    async upsertMany(devicesDto: Device[]) {
        try {
            let created = 0;
            let updated = 0;

            const results = await Promise.all(
                devicesDto.map(async (device) => {
                    try {
                        const deviceId = device.device_id.toString();
                        const exists = await this.prismaService.device.findUnique({
                            where: { deviceId: deviceId },
                        });

                        if (exists) {
                            updated++;
                        } else {
                            created++;
                        }

                        const deviceToUpdate = {
                            deviceId: deviceId,
                            alias: device.alias,
                            imei: device.imei?.toString() || null,
                        }

                        return await this.prismaService.device.upsert({
                            where: { deviceId: deviceId },
                            update: deviceToUpdate,
                            create: deviceToUpdate,
                        });
                    } catch (error) {
                        console.error(`Error upserting device ${device.device_id}:`, error);
                        return null;
                    }
                })
            );

            const devices = results.filter(r => r !== null);

            return {
                total: devicesDto.length,
                created,
                updated,
                failed: devicesDto.length - devices.length,
                devices,
            };
        } catch (error) {
            console.error('Error syncing devices:', error);
            throw new InternalServerErrorException('Ошибка при синхронизации устройств');
        }
    }

    findAll() {
        return this.prismaService.device.findMany();
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
