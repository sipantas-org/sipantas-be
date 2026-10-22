import { ApiProperty } from '@nestjs/swagger';

export class RegencyResponseDto {
  @ApiProperty({ example: '11.01' })
  id!: string;

  @ApiProperty({ example: '11' })
  provinceId!: string;

  @ApiProperty({ example: 'Kabupaten Aceh Selatan' })
  name!: string;
}

export class DistrictOfRegencyDto {
  @ApiProperty({ example: '11.01.01' })
  id!: string;

  @ApiProperty({ example: '11.01' })
  regencyId!: string;

  @ApiProperty({ example: 'Bakongan' })
  name!: string;
}

export class RegencyDetailResponseDto extends RegencyResponseDto {
  @ApiProperty({ type: [DistrictOfRegencyDto] })
  districts!: DistrictOfRegencyDto[];
}
