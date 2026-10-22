import { ApiProperty } from '@nestjs/swagger';

export class ProvinceResponseDto {
  @ApiProperty({ example: '11' })
  id!: string;

  @ApiProperty({ example: 'Aceh' })
  name!: string;
}

export class RegencyOfProvinceDto {
  @ApiProperty({ example: '11.01' })
  id!: string;

  @ApiProperty({ example: '11' })
  provinceId!: string;

  @ApiProperty({ example: 'Kabupaten Aceh Selatan' })
  name!: string;
}

export class ProvinceDetailResponseDto extends ProvinceResponseDto {
  @ApiProperty({ type: [RegencyOfProvinceDto] })
  regencies!: RegencyOfProvinceDto[];
}
