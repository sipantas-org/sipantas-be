import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateDistrictDto } from '../dto/create-district.dto.js';
import { UpdateDistrictDto } from '../dto/update-district.dto.js';

@Injectable()
export class MasterAreaDistrictRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDistrictDto) {
    return this.prisma.masterAreaDistrict.create({
      data,
      include: {
        regency: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.masterAreaDistrict.findUnique({
      where: { id },
      include: {
        // regency: {
        //   include: {
        //     province: true,
        //   },
        // },
        villages: true,
      },
    });
  }

  async findAll(regencyId?: string) {
    return this.prisma.masterAreaDistrict.findMany({
      where: regencyId ? { regencyId } : undefined,
    });
  }

  async update(id: string, data: UpdateDistrictDto) {
    return this.prisma.masterAreaDistrict.update({
      where: { id },
      data,
      include: {
        regency: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.masterAreaDistrict.delete({
      where: { id },
    });
  }

  async existsRegency(regencyId: string): Promise<boolean> {
    const count = await this.prisma.masterAreaRegency.count({
      where: { id: regencyId },
    });
    return count > 0;
  }
}
