import {
  Controller,
  Req,
  UseGuards,
  Post,
  Get,
  Patch,
  BadRequestException,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { CreatePlanDto } from '../dto/CreatePlan.dto';
import { PatchPlanDto } from '../dto/PatchPlan.dto';
import { PlanProxyService } from '../service/plan-proxy.service';

@Controller('couples/:coupleId/plans')
@ApiTags('Plan에 대한 Rest API')
export class PlanController {
  constructor(private readonly planProxyService: PlanProxyService) {}

  @Get()
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'day', required: true })
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;

      const { year, month, day } = req.query;
      if (!year || !month) {
        throw new BadRequestException('Bad Request');
      }
      let now = `${year}-${month}`;
      if (day) {
        now = `${now}-${day}`;
      }
      return await this.planProxyService.findMany(coupleId, new Date(now));
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post('create')
  @ApiBody({ type: CreatePlanDto })
  async create(@Req() req: UserAuthRequest) {
    const coupleId = req.params.coupleId;
    const dto = plainToInstance(CreatePlanDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }

    try {
      await this.planProxyService.create(coupleId, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server errorW');
    }
  }

  @Patch(':planId')
  @ApiParam({ name: 'planId', required: true })
  @ApiBody({ type: PatchPlanDto })
  async patch(@Req() req: UserAuthRequest) {
    const planId = req.params.planId;
    const dto = plainToInstance(PatchPlanDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors[0].toString());
    }
    try {
      await this.planProxyService.patch(planId, dto);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Delete(':planId')
  @ApiParam({ name: 'planId', required: true })
  async remove(@Req() req: UserAuthRequest) {
    try {
      const planId = req.params.planId;
      await this.planProxyService.remove(planId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
