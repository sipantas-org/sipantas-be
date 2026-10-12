import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Prisma, Sector } from '../../../generated/prisma/client.js';
import { CreateSectorDto } from '../dto/create-sector.dto.js';
import { UpdateSectorDto } from '../dto/update-sector.dto.js';
import { QuerySectorDto } from '../dto/query-sector.dto.js';
import { SectorResponseDto } from '../dto/response-sector.dto.js';

@Injectable()
export class SectorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSectorDto): Promise<Sector> {
    return this.prisma.sector.create({
      data,
    });
  }

  async findAll(query: QuerySectorDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status } = query;

    const where: Prisma.SectorWhereInput = {};

    if (search) {
      where.OR = [
        { sectorName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.sector.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          // children: true,
        },
      }),
      this.prisma.sector.count({ where }),
    ]);

    const formattedData = plainToInstance(SectorResponseDto, data);

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

  async findById(sectorId: number) {
    const data = await this.prisma.sector.findUnique({
      where: { sectorId },
      include: {
        children: true,
      },
    });

    const formattedData = plainToInstance(SectorResponseDto, data);

    return formattedData;
  }

  async update(sectorId: number, data: UpdateSectorDto): Promise<Sector> {
    return this.prisma.sector.update({
      where: { sectorId },
      data,
    });
  }

  async delete(sectorId: number): Promise<Sector> {
    return this.prisma.sector.delete({
      where: { sectorId },
    });
  }
}
