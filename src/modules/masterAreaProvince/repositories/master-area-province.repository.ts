import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateProvinceDto } from '../dto/create-province.dto.js';
import { UpdateProvinceDto } from '../dto/update-province.dto.js';

@Injectable()
export class MasterAreaProvinceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProvinceDto) {
    return this.prisma.master_Area_Province.create({ data });
  }

  async findById(id: string) {
    return this.prisma.master_Area_Province.findUnique({
      where: { id },
      include: {
        regencies: true,
      },
    });
  }

  async findAll() {
    return this.prisma.master_Area_Province.findMany({
      include: {},
    });
  }

  async update(id: string, data: UpdateProvinceDto) {
    return this.prisma.master_Area_Province.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.master_Area_Province.delete({
      where: { id },
    });
  }
}
