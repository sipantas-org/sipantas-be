import { ApiProperty } from '@nestjs/swagger';

export class DistrictResponseDto {
  @ApiProperty({ example: '11.01.01' })
  id!: string;

  @ApiProperty({ example: '11.01' })
  regencyId!: string;

  @ApiProperty({ example: 'Bakongan' })
  name!: string;
}

export class RegencyOfDistrictDto {
  @ApiProperty({ example: '11.01' })
  id!: string;

  @ApiProperty({ example: '11' })
  provinceId!: string;

  @ApiProperty({ example: 'Kabupaten Aceh Selatan' })
  name!: string;
}

export class DistrictWithRegencyResponseDto extends DistrictResponseDto {
  @ApiProperty({ type: RegencyOfDistrictDto })
  regency!: RegencyOfDistrictDto;
}

export class DistrictListItemResponseDto extends DistrictResponseDto {
  @ApiProperty({ example: 'Kabupaten Aceh Selatan', nullable: true })
  regencyName!: string | null;

  @ApiProperty({ example: 'Aceh', nullable: true })
  provinceName!: string | null;
}

export class VillageOfDistrictDto {
  @ApiProperty({ example: '11.01.01.2001' })
  id!: string;

  @ApiProperty({ example: '11.01.01' })
  districtId!: string;

  @ApiProperty({ example: 'Keude Bakongan' })
  name!: string;
}

export class DistrictDetailResponseDto extends DistrictResponseDto {
  @ApiProperty({ type: [VillageOfDistrictDto] })
  villages!: VillageOfDistrictDto[];
}
