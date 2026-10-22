import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MasterAreaDistrictRepository } from './repositories/master-area-district.repository.js';
import { CreateDistrictDto } from './dto/create-district.dto.js';
import { UpdateDistrictDto } from './dto/update-district.dto.js';
import { QueryDistrictDto } from './dto/query-district.dto.js';

@Injectable()
export class MasterAreaDistrictService {
  constructor(private readonly repository: MasterAreaDistrictRepository) {}

  async create(createDto: CreateDistrictDto) {
    const existingDistrict = await this.repository.findById(createDto.id);
    if (existingDistrict) {
      throw new ConflictException(
        `District with ID '${createDto.id}' already exists.`,
      );
    }

    const regencyExists = await this.repository.existsRegency(
      createDto.regencyId,
    );
    if (!regencyExists) {
      throw new BadRequestException(
        `Regency with ID '${createDto.regencyId}' does not exist.`,
      );
    }

    return this.repository.create(createDto);
  }

  async findAll(query: QueryDistrictDto) {
    return this.repository.findAll(query);
  }

  async findOne(id: string) {
    const district = await this.repository.findById(id);
    if (!district) {
      throw new NotFoundException(`District with ID '${id}' not found.`);
    }
    return district;
  }

  async update(id: string, updateDto: UpdateDistrictDto) {
    await this.findOne(id); // Throws 404 if district not found

    if (updateDto.regencyId) {
      const regencyExists = await this.repository.existsRegency(
        updateDto.regencyId,
      );
      if (!regencyExists) {
        throw new BadRequestException(
          `Regency with ID '${updateDto.regencyId}' does not exist.`,
        );
      }
    }

    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Throws 404 if district not found
    return this.repository.delete(id);
  }
}
