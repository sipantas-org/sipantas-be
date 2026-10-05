import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateDisasterDto } from '../dto/create-disaster.dto.js';
import { UpdateDisasterDto } from '../dto/update-disaster.dto.js';
import { Disaster } from '../../../generated/prisma/client.js';

@Injectable()
export class DisasterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDisasterDto): Promise<Disaster> {
    return this.prisma.disaster.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.disaster.findMany({
      orderBy: { createdAt: 'desc' },
      omit: {
        provinceId: true,
        regencyId: true,
      },
      include: {
        regency: true,
        province: true,
      },
    });
  }

  async findById(disasterId: number) {
    return this.prisma.disaster.findUnique({
      where: { disasterId },
      omit: {
        provinceId: true,
        regencyId: true,
      },
      include: {
        regency: true,
        province: true,
      },
    });
  }

  async update(disasterId: number, data: UpdateDisasterDto): Promise<Disaster> {
    return this.prisma.disaster.update({
      where: { disasterId },
      data,
    });
  }

  async delete(disasterId: number): Promise<Disaster> {
    return this.prisma.disaster.delete({
      where: { disasterId },
    });
  }
}
