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
import { SurveyFurnitureDetailService } from './survey-furniture-detail.service.js';
import { QuerySurveyFurnitureDetailDto } from './dto/query-survey-furniture-detail.dto.js';
import { CreateSurveyFurnitureDetailDto } from './dto/create-survey-furniture-detail.dto.js';
import { UpdateSurveyFurnitureDetailDto } from './dto/update-survey-furniture-detail.dto.js';

@ApiTags('Survey Furniture Detail')
@ApiBearerAuth('access-token')
@Controller('survey-furniture-details')
export class SurveyFurnitureDetailController {
  constructor(
    private readonly surveyFurnitureDetailService: SurveyFurnitureDetailService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create survey furniture detail' })
  create(@Body() createDto: CreateSurveyFurnitureDetailDto) {
    return this.surveyFurnitureDetailService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all survey furniture details with pagination and filter',
  })
  findAll(@Query() query: QuerySurveyFurnitureDetailDto) {
    return this.surveyFurnitureDetailService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get survey furniture detail by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.surveyFurnitureDetailService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update survey furniture detail by ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSurveyFurnitureDetailDto,
  ) {
    return this.surveyFurnitureDetailService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete survey furniture detail by ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.surveyFurnitureDetailService.remove(id);
  }
}
