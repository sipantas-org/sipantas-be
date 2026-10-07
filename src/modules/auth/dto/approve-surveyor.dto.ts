import { IsIn, IsOptional, IsString } from 'class-validator';

export class ApproveSurveyorDto {
  @IsIn(['Approved', 'Rejected'])
  Status!: 'Approved' | 'Rejected';

  @IsOptional()
  @IsString()
  Description?: string;
}
