import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateVillageDto } from '../dto/create-village.dto.js';
import { UpdateVillageDto } from '../dto/update-village.dto.js';

@Injectable()
export class MasterAreaVillageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVillageDto) {
    return this.prisma.masterAreaVillage.create({
      data,
      include: {
        district: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.masterAreaVillage.findUnique({
      where: { id },
      // include: {
      //   district: {
      //     include: {
      //       regency: {
      //         include: {
      //           province: true,
      //         },
      //       },
      //     },
      //   },
      // },
    });
  }

  async findAll(districtId?: string) {
    return this.prisma.masterAreaVillage.findMany({
      where: districtId ? { districtId } : undefined,
    });
  }

  async update(id: string, data: UpdateVillageDto) {
    return this.prisma.masterAreaVillage.update({
      where: { id },
      data,
      include: {
        district: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaVillage.delete({
      where: { id },
    });
  }

  async existsDistrict(districtId: string): Promise<boolean> {
    const count = await this.prisma.masterAreaDistrict.count({
      where: { id: districtId },
    });
    return count > 0;
  }
}
