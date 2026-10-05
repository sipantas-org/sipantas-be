import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateRegencyDto } from '../dto/create-regency.dto.js';
import { UpdateRegencyDto } from '../dto/update-regency.dto.js';

@Injectable()
export class MasterAreaRegencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRegencyDto) {
    return this.prisma.master_Area_Regency.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.master_Area_Regency.findUnique({
      where: { id },
      include: {
        districts: true,
      },
    });
  }

  async findAll(provinceId?: string) {
    return this.prisma.master_Area_Regency.findMany({
      where: provinceId ? { provinceId } : undefined,
    });
  }

  async update(id: string, data: UpdateRegencyDto) {
    return this.prisma.master_Area_Regency.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.master_Area_Regency.delete({
      where: { id },
    });
  }

  async existsProvince(provinceId: string): Promise<boolean> {
    const count = await this.prisma.master_Area_Province.count({
      where: { id: provinceId },
    });
    return count > 0;
  }
}
