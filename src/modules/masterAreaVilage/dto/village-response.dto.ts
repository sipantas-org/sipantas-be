import { ApiProperty } from '@nestjs/swagger';

export class VillageResponseDto {
  @ApiProperty({ example: '11.01.01.2001' })
  id!: string;

  @ApiProperty({ example: '11.01.01' })
  districtId!: string;

  @ApiProperty({ example: 'Keude Bakongan' })
  name!: string;
}

export class DistrictOfVillageDto {
  @ApiProperty({ example: '11.01.01' })
  id!: string;

  @ApiProperty({ example: '11.01' })
  regencyId!: string;

  @ApiProperty({ example: 'Bakongan' })
  name!: string;
}

export class VillageWithDistrictResponseDto extends VillageResponseDto {
  @ApiProperty({ type: DistrictOfVillageDto })
  district!: DistrictOfVillageDto;
}

export class VillageListItemResponseDto extends VillageResponseDto {
  @ApiProperty({ example: 'Bakongan', nullable: true })
  districtName!: string | null;

  @ApiProperty({ example: 'Kabupaten Aceh Selatan', nullable: true })
  regencyName!: string | null;
}
