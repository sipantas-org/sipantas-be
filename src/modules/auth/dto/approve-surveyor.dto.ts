import { IsIn, IsOptional, IsString } from 'class-validator';

export class ApproveSurveyorDto {
  @IsIn(['Approved', 'Rejected'])
  status!: 'Approved' | 'Rejected';

  @IsOptional()
  @IsString()
  description?: string;
}
