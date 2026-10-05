import { Injectable, NotFoundException } from '@nestjs/common';
import { DisasterRepository } from './repositories/disaster.repository.js';
import { CreateDisasterDto } from './dto/create-disaster.dto.js';
import { UpdateDisasterDto } from './dto/update-disaster.dto.js';
import { QueryDisasterDto } from './dto/dto.js';

@Injectable()
export class DisasterService {
  constructor(private readonly disasterRepository: DisasterRepository) {}

  async create(createDisasterDto: CreateDisasterDto) {
    return this.disasterRepository.create(createDisasterDto);
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
    return this.disasterRepository.update(id, updateDisasterDto);
  }

  async remove(id: number) {
    await this.findOne(id); // Ensure entity exists before deleting
    return this.disasterRepository.delete(id);
  }
}
