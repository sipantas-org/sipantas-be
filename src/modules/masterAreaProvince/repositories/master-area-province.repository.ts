import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateProvinceDto } from '../dto/create-province.dto.js';
import { UpdateProvinceDto } from '../dto/update-province.dto.js';

@Injectable()
export class MasterAreaProvinceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProvinceDto) {
    return this.prisma.masterAreaProvince.create({ data });
  }

  async findById(id: string) {
    return this.prisma.masterAreaProvince.findUnique({
      where: { id },
      include: {
        regencies: true,
      },
    });
  }

  async findAll() {
    return this.prisma.masterAreaProvince.findMany({
      include: {},
    });
  }

  async update(id: string, data: UpdateProvinceDto) {
    return this.prisma.masterAreaProvince.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaProvince.delete({
      where: { id },
    });
  }
}
