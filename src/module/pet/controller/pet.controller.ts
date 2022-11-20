import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Patch,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PatchPetDto } from '../dto/PatchPet.dto';
import { PetProxyService } from '../service/pet-proxy.service';

@ApiTags('Pet에 대한 Rest API')
@Controller('couples/:coupleId/pets')
@UseGuards(UserAuthGuard)
export class PetController {
  constructor(private readonly petProxyService: PetProxyService) {}
  @Get(':petId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBearerAuth('jwt-token')
  async findUnique(@Req() req: UserAuthRequest) {
    try {
      return await this.petProxyService.findPetDto(req.params.petId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Post(':petId/feed')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBearerAuth('jwt-token')
  async feed(@Req() req: UserAuthRequest) {
    return await this.petProxyService.feedAndFindReactionDto(req.params.petId);
  }

  @Post(':petId/touch')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBearerAuth('jwt-token')
  async touch(@Req() req: UserAuthRequest) {
    try {
      return await this.petProxyService.touchAndFindReactionDto(
        req.params.petId,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Patch(':petId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBody({ type: PatchPetDto })
  @ApiBearerAuth('jwt-token')
  async patch(@Req() req: UserAuthRequest) {
    try {
      const petId = req.params.petId;
      const dto = plainToInstance(PatchPetDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException(errors[0].toString());
      }
      await this.petProxyService.patch(petId, dto.nickName);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
