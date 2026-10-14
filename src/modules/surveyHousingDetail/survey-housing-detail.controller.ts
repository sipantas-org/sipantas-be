import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SurveyHousingDetailService } from './survey-housing-detail.service.js';
import { QuerySurveyHousingDetailDto } from './dto/query-survey-housing-detail.dto.js';
import { CreateSurveyHousingDetailDto } from './dto/create-survey-housing-detail.dto.js';
import { UpdateSurveyHousingDetailDto } from './dto/update-survey-housing-detail.dto.js';

@ApiTags('Survey Housing Detail')
@ApiBearerAuth('access-token')
@Controller('survey-housing-details')
export class SurveyHousingDetailController {
  constructor(
    private readonly surveyHousingDetailService: SurveyHousingDetailService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create survey housing detail' })
  create(@Body() createDto: CreateSurveyHousingDetailDto) {
    return this.surveyHousingDetailService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all survey housing details with pagination and filter',
  })
  findAll(@Query() query: QuerySurveyHousingDetailDto) {
    return this.surveyHousingDetailService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get survey housing detail by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.surveyHousingDetailService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update survey housing detail by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSurveyHousingDetailDto,
  ) {
    return this.surveyHousingDetailService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete survey housing detail by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.surveyHousingDetailService.remove(id);
  }
}
