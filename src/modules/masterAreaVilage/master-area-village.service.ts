import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MasterAreaVillageRepository } from './repositories/master-area-village.repository.js';
import { CreateVillageDto } from './dto/create-village.dto.js';
import { UpdateVillageDto } from './dto/update-village.dto.js';
import { QueryVillageDto } from './dto/query-village.dto.js';

@Injectable()
export class MasterAreaVillageService {
  constructor(private readonly repository: MasterAreaVillageRepository) {}

  async create(createDto: CreateVillageDto) {
    const existingVillage = await this.repository.findById(createDto.id);
    if (existingVillage) {
      throw new ConflictException(
        `Village with ID '${createDto.id}' already exists.`,
      );
    }

    const districtExists = await this.repository.existsDistrict(
      createDto.districtId,
    );
    if (!districtExists) {
      throw new BadRequestException(
        `District with ID '${createDto.districtId}' does not exist.`,
      );
    }

    return this.repository.create(createDto);
  }

  async findAll(query: QueryVillageDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: string) {
    const village = await this.repository.findById(id);
    if (!village) {
      throw new NotFoundException(`Village with ID '${id}' not found.`);
    }
    return village;
  }

  async update(id: string, updateDto: UpdateVillageDto) {
    await this.findOne(id); // Throws 404 if village not found

    if (updateDto.districtId) {
      const districtExists = await this.repository.existsDistrict(
        updateDto.districtId,
      );
      if (!districtExists) {
        throw new BadRequestException(
          `District with ID '${updateDto.districtId}' does not exist.`,
        );
      }
    }

    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Throws 404 if village not found
    return this.repository.delete(id);
  }
}
