import { Injectable, NotFoundException } from '@nestjs/common';
import { HousingAssessmentPartRepository } from './repositories/housing-assessment-part.repository.js';
import { CreateHousingAssessmentPartDto } from './dto/create-housing-assessment-part.dto.js';
import { UpdateHousingAssessmentPartDto } from './dto/update-housing-assessment-part.dto.js';
import { QueryHousingAssessmentPartDto } from './dto/query-housing-assessment-part.dto.js';

@Injectable()
export class HousingAssessmentPartService {
  constructor(private readonly repository: HousingAssessmentPartRepository) {}

  async create(createDto: CreateHousingAssessmentPartDto) {
    return this.repository.create(createDto);
  }

  async findAll(query: QueryHousingAssessmentPartDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: number) {
    const part = await this.repository.findById(id);

    if (!part) {
      throw new NotFoundException(
        `Housing Assessment Part dengan ID ${id} tidak ditemukan`,
      );
    }

    return part;
  }

  async update(id: number, updateDto: UpdateHousingAssessmentPartDto) {
    await this.findOne(id); // Pastikan record ada sebelum update
    return this.repository.update(id, updateDto);
  }

  async remove(id: number) {
    await this.findOne(id); // Pastikan record ada sebelum delete
    return this.repository.delete(id);
  }
}
