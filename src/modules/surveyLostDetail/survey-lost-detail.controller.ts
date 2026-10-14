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
import { SurveyLostDetailService } from './survey-lost-detail.service.js';
import { QuerySurveyLostDetailDto } from './dto/query-survey-lost-detail.dto.js';
import { CreateSurveyLostDetailDto } from './dto/create-survey-lost-detail.dto.js';
import { UpdateSurveyLostDetailDto } from './dto/update-survey-lost-detail.dto.js';

@ApiTags('Survey Lost Detail')
@ApiBearerAuth('access-token')
@Controller('survey-lost-details')
export class SurveyLostDetailController {
  constructor(
    private readonly surveyLostDetailService: SurveyLostDetailService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create survey lost detail' })
  create(@Body() createDto: CreateSurveyLostDetailDto) {
    return this.surveyLostDetailService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all survey lost details with pagination and filter',
  })
  findAll(@Query() query: QuerySurveyLostDetailDto) {
    return this.surveyLostDetailService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get survey lost detail by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.surveyLostDetailService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update survey lost detail by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSurveyLostDetailDto,
  ) {
    return this.surveyLostDetailService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete survey lost detail by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.surveyLostDetailService.remove(id);
  }
}
