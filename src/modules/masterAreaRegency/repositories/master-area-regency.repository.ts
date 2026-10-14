import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateRegencyDto } from '../dto/create-regency.dto.js';
import { UpdateRegencyDto } from '../dto/update-regency.dto.js';

@Injectable()
export class MasterAreaRegencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRegencyDto) {
    return this.prisma.masterAreaRegency.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.masterAreaRegency.findUnique({
      where: { id },
      include: {
        districts: true,
      },
    });
  }

  async findAll(provinceId?: string) {
    return this.prisma.masterAreaRegency.findMany({
      where: provinceId ? { provinceId } : undefined,
    });
  }

  async update(id: string, data: UpdateRegencyDto) {
    return this.prisma.masterAreaRegency.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaRegency.delete({
      where: { id },
    });
  }

  async existsProvince(provinceId: string): Promise<boolean> {
    const count = await this.prisma.masterAreaProvince.count({
      where: { id: provinceId },
    });
    return count > 0;
  }
}
