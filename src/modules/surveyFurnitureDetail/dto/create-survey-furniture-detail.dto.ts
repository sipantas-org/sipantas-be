import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DamageCategory } from '../../../generated/prisma/enums.js';

export class CreateSurveyFurnitureDetailDto {
  @ApiProperty({ description: 'Name of the furniture item' })
  @IsString()
  @IsNotEmpty()
  furnitureName: string;

  @ApiProperty({ enum: DamageCategory, description: 'Category of damage' })
  @IsEnum(DamageCategory)
  @IsNotEmpty()
  damageCategory: DamageCategory;

  @ApiProperty({ description: 'Quantity of items' })
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Unit price of the item' })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty({ description: 'Total price of the items' })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ description: 'Damage description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
