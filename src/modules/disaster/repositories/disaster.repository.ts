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

  async findAll(): Promise<Disaster[]> {
    return this.prisma.disaster.findMany({
      orderBy: { Created_At: 'desc' },
    });
  }

  async findById(ID_Disaster: number): Promise<Disaster | null> {
    return this.prisma.disaster.findUnique({
      where: { ID_Disaster },
    });
  }

  async update(
    ID_Disaster: number,
    data: UpdateDisasterDto,
  ): Promise<Disaster> {
    return this.prisma.disaster.update({
      where: { ID_Disaster },
      data,
    });
  }

  async delete(ID_Disaster: number): Promise<Disaster> {
    return this.prisma.disaster.delete({
      where: { ID_Disaster },
    });
  }
}
