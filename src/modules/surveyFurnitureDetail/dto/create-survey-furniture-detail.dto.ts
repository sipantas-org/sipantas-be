import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsOptional,
} from 'class-validator';
import { DamageCategory } from '../../../generated/prisma/enums.js';
import { DisplayName } from '../../../common/decorators/display-name.decorator.js';

export class CreateSurveyFurnitureDetailDto {
  @ApiProperty({ description: 'Name of the furniture item' })
  @DisplayName('Furniture Name')
  @IsString()
  @IsNotEmpty()
  furnitureName: string;

  @ApiProperty({ enum: DamageCategory, description: 'Category of damage' })
  @DisplayName('Damage Category')
  @IsEnum(DamageCategory)
  @IsNotEmpty()
  damageCategory: DamageCategory;

  @ApiProperty({ description: 'Quantity of items' })
  @DisplayName('Quantity')
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Unit price of the item' })
  @DisplayName('Unit Price')
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty({ description: 'Total price of the items' })
  @DisplayName('Total Price')
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ description: 'Damage description' })
  @DisplayName('Description')
  @IsString()
  @IsOptional()
  description: string;
}
