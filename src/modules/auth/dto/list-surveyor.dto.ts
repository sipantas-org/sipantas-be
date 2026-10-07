import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListSurveyorDto {
  @IsOptional()
  @IsIn(['Pending', 'Active', 'Inactive', 'Rejected'])
  status?: 'Pending' | 'Active' | 'Inactive' | 'Rejected';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
