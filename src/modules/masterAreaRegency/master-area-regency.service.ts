import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MasterAreaRegencyRepository } from './repositories/master-area-regency.repository.js';
import { CreateRegencyDto } from './dto/create-regency.dto.js';
import { UpdateRegencyDto } from './dto/update-regency.dto.js';

@Injectable()
export class MasterAreaRegencyService {
  constructor(private readonly repository: MasterAreaRegencyRepository) {}

  async create(createDto: CreateRegencyDto) {
    const existingRegency = await this.repository.findById(createDto.id);
    if (existingRegency) {
      throw new ConflictException(
        `Regency with ID '${createDto.id}' already exists.`,
      );
    }

    const provinceExists = await this.repository.existsProvince(
      createDto.provinceId,
    );
    if (!provinceExists) {
      throw new BadRequestException(
        `Province with ID '${createDto.provinceId}' does not exist.`,
      );
    }

    return this.repository.create(createDto);
  }

  async findAll(provinceId?: string) {
    return this.repository.findAll(provinceId);
  }

  async findOne(id: string) {
    const regency = await this.repository.findById(id);
    if (!regency) {
      throw new NotFoundException(`Regency with ID '${id}' not found.`);
    }
    return regency;
  }

  async update(id: string, updateDto: UpdateRegencyDto) {
    await this.findOne(id); // Throws 404 if regency not found

    if (updateDto.provinceId) {
      const provinceExists = await this.repository.existsProvince(
        updateDto.provinceId,
      );
      if (!provinceExists) {
        throw new BadRequestException(
          `Province with ID '${updateDto.provinceId}' does not exist.`,
        );
      }
    }

    return this.repository.update(id, updateDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Throws 404 if regency not found
    return this.repository.delete(id);
  }
}
