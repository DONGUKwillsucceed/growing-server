import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { BAD_REQUEST } from '../const';
import { CreatePlanDto } from '../dto/CreatePlan.dto';
import { PatchPlanDto } from '../dto/PatchPlan.dto';
import { PlanMapper } from '../mapper/plan.mapper';
import { PlanProxyService } from '../service/plan-proxy.service';

@Controller('couples/:coupleId/plans')
@UseGuards(UserAuthGuard)
@UseFilters(HttpExceptionFilter)
@ApiTags('Plan์ ๋ํ Rest API')
export class PlanController {
  constructor(
    private readonly planProxyService: PlanProxyService,
    private readonly PlanMapper: PlanMapper,
  ) {}

  @Get()
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'day', required: true })
  async findMany(
    @Param('coupleId') coupleId: string,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('day') day: string,
  ) {
    if (!year || !month) {
      throw new BadRequestException(BAD_REQUEST);
    }
    let now = `${year}-${month}`;
    if (day) {
      now = `${now}-${day}`;
    }
    return this.planProxyService
      .findMany(coupleId, new Date(now))
      .then((plans) => this.PlanMapper.mapFromRelationForMany(plans));
  }

  @Post('create')
  @ApiBody({ type: CreatePlanDto })
  async create(
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: CreatePlanDto,
  ) {
    return this.planProxyService
      .create(coupleId, dto)
      .then((plan) => this.PlanMapper.mapFromRelationForOne(plan));
  }

  @Patch(':planId')
  @ApiParam({ name: 'planId', required: true })
  @ApiBody({ type: PatchPlanDto })
  async patch(
    @Param('planId') planId: string,
    @Body(ValidationPipe) dto: PatchPlanDto,
  ) {
    return this.planProxyService
      .patch(planId, dto)
      .then((plan) => this.PlanMapper.mapFromRelationForOne(plan));
  }

  @Delete(':planId')
  @ApiParam({ name: 'planId', required: true })
  async remove(@Param('planId') planId: string) {
    await this.planProxyService.remove(planId);
  }
}
