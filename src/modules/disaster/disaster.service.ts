import { Injectable, NotFoundException } from '@nestjs/common';
import { DisasterRepository } from './repositories/disaster.repository.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateDisasterDto } from './dto/create-disaster.dto.js';
import { UpdateDisasterDto } from './dto/update-disaster.dto.js';
import { QueryDisasterDto } from './dto/query-disaster.dto.js';
import { plainToInstance } from 'class-transformer';
import { DisasterResponseDto } from './dto/response-disaster.dto.js';

@Injectable()
export class DisasterService {
  constructor(
    private readonly disasterRepository: DisasterRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createDisasterDto: CreateDisasterDto) {
    const [yearStr, monthStr] = createDisasterDto.disasterDate.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    // Set default tanggal ke tanggal 1 di bulan dan tahun tersebut
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const nextMonthStartDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    const count = await this.prisma.disaster.count({
      where: {
        disasterDate: {
          gte: startDate,
          lt: nextMonthStartDate,
        },
      },
    });

    const sequence = String(count + 1).padStart(3, '0');
    const monthPadded = String(month).padStart(2, '0');
    const disasterCode = `BNC${year}${monthPadded}-${sequence}`;

    const result = await this.disasterRepository.create({
      ...createDisasterDto,
      disasterCode,
      disasterDate: startDate,
    });

    return plainToInstance(DisasterResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(query: QueryDisasterDto) {
    const disasters = await this.disasterRepository.findAll(query);
    return disasters;
  }

  async findOne(id: number) {
    const disaster = await this.disasterRepository.findById(id);
    if (!disaster) {
      throw new NotFoundException('Data not found');
    }
    return disaster;
  }

  async update(id: number, updateDisasterDto: UpdateDisasterDto) {
    await this.findOne(id); // Ensure entity exists before updating

    let disasterDate: Date | undefined;
    if (updateDisasterDto.disasterDate) {
      const [yearStr, monthStr] = updateDisasterDto.disasterDate.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      disasterDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    }

    const result = await this.disasterRepository.update(id, {
      ...updateDisasterDto,
      ...(disasterDate ? { disasterDate } : {}),
    });

    return plainToInstance(DisasterResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure entity exists before deleting
    return this.disasterRepository.delete(id);
  }
}
