import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Authority,
  DamageLevel,
  SurveyStatus,
} from '../../../generated/prisma/enums.js';
import { CreateSurveyFurnitureDetailDto } from '../../surveyFurnitureDetail/dto/create-survey-furniture-detail.dto.js';
import { CreateSurveyHousingDetailDto } from '../../surveyHousingDetail/dto/create-survey-housing-detail.dto.js';
import { CreateSurveyLostDetailDto } from '../../surveyLostDetail/dto/create-survey-lost-detail.dto.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export {
  CreateSurveyFurnitureDetailDto,
  CreateSurveyHousingDetailDto,
  CreateSurveyLostDetailDto,
};

export class CreateSurveyDto {
  @ApiProperty({ description: 'ID Bencana', example: 1 })
  @DisplayName('Disaster ID')
  @IsInt()
  disasterId: number;

  @ApiProperty({ description: 'ID Sektor', example: 1 })
  @DisplayName('Sector ID')
  @IsInt()
  sectorId: number;

  @ApiProperty({
    enum: SurveyStatus,
    enumName: 'SurveyStatus',
    example: SurveyStatus.Pending,
    description: 'Status proses survei',
  })
  @DisplayName('Survey Status')
  @IsEnum(SurveyStatus)
  surveyStatus: SurveyStatus;

  @ApiPropertyOptional({
    description: 'ID Provinsi (Master Area)',
    example: '11',
    maxLength: 20,
  })
  @DisplayName('Province ID')
  @IsOptional()
  @IsString()
  @MaxLength(20)
  provinceId?: string;

  @ApiPropertyOptional({
    description: 'ID Kabupaten / Kota (Master Area)',
    example: '11.01',
    maxLength: 20,
  })
  @DisplayName('Regency ID')
  @IsOptional()
  @IsString()
  @MaxLength(20)
  regencyId?: string;

  @ApiPropertyOptional({
    description: 'ID Kecamatan (Master Area)',
    example: '11.01.01',
    maxLength: 20,
  })
  @DisplayName('District ID')
  @IsOptional()
  @IsString()
  @MaxLength(20)
  districtId?: string;

  @ApiPropertyOptional({
    description: 'ID Kelurahan / Desa (Master Area)',
    example: '11.01.01.2001',
    maxLength: 20,
  })
  @DisplayName('Village ID')
  @IsOptional()
  @IsString()
  @MaxLength(20)
  villageId?: string;

  @ApiProperty({
    description: 'Detail alamat spesifik lokasi survei',
    example: 'Jl. Raya Cipanas No. 12, RT 01 / RW 04',
  })
  @DisplayName('Address Detail')
  @IsString()
  addressDetail: string;

  @ApiProperty({
    enum: Authority,
    enumName: 'Authority',
    example: Authority.Pusat,
    description: 'Kewenangan aset/infrastruktur',
  })
  @DisplayName('Authority')
  @IsEnum(Authority)
  authority: Authority;

  @ApiProperty({
    description: 'Nama aset atau infrastruktur yang disurvei',
    example: 'Jembatan Penghubung Desa',
  })
  @DisplayName('Asset Name')
  @IsString()
  assetName: string;

  @ApiProperty({
    description: 'Koordinat garis lintang (latitude)',
    example: '-6.2088',
  })
  @DisplayName('Latitude')
  @IsString()
  latitude: string;

  @ApiProperty({
    description: 'Koordinat garis bujur (longitude)',
    example: '106.8456',
  })
  @DisplayName('Longitude')
  @IsString()
  longitude: string;

  @ApiProperty({ description: 'Volume kerusakan', example: '150' })
  @DisplayName('Volume')
  @IsString()
  volume: string;

  @ApiProperty({ description: 'Satuan volume kerusakan', example: 'm2' })
  @DisplayName('Volume Unit')
  @IsString()
  volumeUnit: string;

  @ApiPropertyOptional({
    description: 'Keterangan satuan volume lainnya jika memilih custom/other',
    example: 'meter lari',
  })
  @DisplayName('Other Volume Unit')
  @IsOptional()
  @IsString()
  volumeUnitOther?: string;

  @ApiProperty({
    description: 'Total estimasi harga unit bangunan/fisik',
    example: 50000000,
  })
  @DisplayName('Total Unit Price')
  @IsNumber()
  totalPriceUnit: number;

  @ApiProperty({
    description: 'Total estimasi harga perabot/furniture',
    example: 12500000,
  })
  @DisplayName('Total Furniture Price')
  @IsNumber()
  totalPriceFurniture: number;

  @ApiPropertyOptional({
    type: [CreateSurveyFurnitureDetailDto],
    description: 'Daftar detail penilaian kerusakan perabot/furniture',
  })
  @DisplayName('Furniture Details')
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyFurnitureDetailDto)
  furnitureDetails?: CreateSurveyFurnitureDetailDto[];

  @ApiPropertyOptional({
    type: [CreateSurveyHousingDetailDto],
    description: 'Daftar detail penilaian kerusakan perumahan/bangunan',
  })
  @DisplayName('Housing Details')
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyHousingDetailDto)
  housingDetails?: CreateSurveyHousingDetailDto[];

  @ApiPropertyOptional({
    type: [CreateSurveyLostDetailDto],
    description: 'Daftar detail estimasi kerugian aset',
  })
  @DisplayName('Lost Details')
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyLostDetailDto)
  lostDetails?: CreateSurveyLostDetailDto[];
}
