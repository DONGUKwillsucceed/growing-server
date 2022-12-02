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
import { PlanProxyService } from '../service/plan-proxy.service';

@Controller('couples/:coupleId/plans')
@UseGuards(UserAuthGuard)
@UseFilters(HttpExceptionFilter)
@ApiTags('Plan에 대한 Rest API')
export class PlanController {
  constructor(private readonly planProxyService: PlanProxyService) {}

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
    return await this.planProxyService.findMany(coupleId, new Date(now));
  }

  @Post('create')
  @ApiBody({ type: CreatePlanDto })
  async create(
    @Param('coupleId') coupleId: string,
    @Body(ValidationPipe) dto: CreatePlanDto,
  ) {
    await this.planProxyService.create(coupleId, dto);
  }

  @Patch(':planId')
  @ApiParam({ name: 'planId', required: true })
  @ApiBody({ type: PatchPlanDto })
  async patch(
    @Param('planId') planId: string,
    @Body(ValidationPipe) dto: PatchPlanDto,
  ) {
    await this.planProxyService.patch(planId, dto);
  }

  @Delete(':planId')
  @ApiParam({ name: 'planId', required: true })
  async remove(@Param('planId') planId: string) {
    await this.planProxyService.remove(planId);
  }
}
