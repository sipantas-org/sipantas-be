import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import { CreateDisasterDto } from '../dto/create-disaster.dto.js';
import { UpdateDisasterDto } from '../dto/update-disaster.dto.js';
import { Disaster } from '../../../generated/prisma/client.js';
import { QueryDisasterDto } from '../dto/query-disaster.dto.js';
import { DisasterResponseDto } from '../dto/response-disaster.dto.js';

@Injectable()
export class DisasterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDisasterDto): Promise<Disaster> {
    return this.prisma.disaster.create({
      data,
    });
  }

  async findAll(query: QueryDisasterDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      search,
      disasterStatus,
      disasterCode,
      disasterName,
      disasterCategory,
    } = query;

    const where: Prisma.DisasterWhereInput = {};

    // 2. Multi-field search using OR
    if (search) {
      where.OR = [
        { disasterCode: { contains: search, mode: 'insensitive' } },
        { disasterName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (disasterCode) {
      where.disasterCode = { contains: disasterCode, mode: 'insensitive' };
    }

    if (disasterName) {
      where.disasterName = { contains: disasterName, mode: 'insensitive' };
    }

    if (disasterCategory) {
      where.disasterCategory = {
        contains: disasterCategory,
        mode: 'insensitive',
      };
    }

    if (disasterStatus) {
      where.disasterStatus = disasterStatus;
    }

    // 3. Query the 'disaster' delegate using the 'where' key
    const [data, total] = await Promise.all([
      this.prisma.disaster.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.disaster.count({ where }),
    ]);

    const formattedData = plainToInstance(DisasterResponseDto, data);

    const totalPages = Math.ceil(total / limit);

    return {
      data: formattedData,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(disasterId: number) {
    const data = this.prisma.disaster.findUnique({
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

    const formattedData = plainToInstance(DisasterResponseDto, data);

    return formattedData;
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
