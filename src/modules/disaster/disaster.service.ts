import { plainToInstance } from 'class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DisasterRepository } from './repositories/disaster.repository.js';
import { CreateDisasterDto } from './dto/create-disaster.dto.js';
import { UpdateDisasterDto } from './dto/update-disaster.dto.js';
import { DisasterResponseDto } from './dto/response-disaster.dto.js';

@Injectable()
export class DisasterService {
  constructor(private readonly disasterRepository: DisasterRepository) {}

  async create(createDisasterDto: CreateDisasterDto) {
    return this.disasterRepository.create(createDisasterDto);
  }

  async findAll(): Promise<DisasterResponseDto[]> {
    const disasters = await this.disasterRepository.findAll();
    return plainToInstance(DisasterResponseDto, disasters);
  }

  async findOne(id: number): Promise<DisasterResponseDto> {
    const disaster = await this.disasterRepository.findById(id);
    if (!disaster) {
      throw new NotFoundException('Data not found');
    }
    return plainToInstance(DisasterResponseDto, disaster);
  }

  async update(id: number, updateDisasterDto: UpdateDisasterDto) {
    await this.findOne(id); // Ensure entity exists before updating
    return this.disasterRepository.update(id, updateDisasterDto);
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure entity exists before deleting
    return this.disasterRepository.delete(id);
  }
}
