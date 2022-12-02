import {
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  UseFilters,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/exception.filter';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { ValidationPipe } from 'src/common/validation/validation.pipe';
import { PatchPetDto } from '../dto/PatchPet.dto';
import { PetProxyService } from '../service/pet-proxy.service';

@ApiTags('Pet에 대한 Rest API')
@Controller('couples/:coupleId/pets')
@UseFilters(HttpExceptionFilter)
@UseGuards(UserAuthGuard)
export class PetController {
  constructor(private readonly petProxyService: PetProxyService) {}
  @Get(':petId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBearerAuth('jwt-token')
  async findUnique(@Param('petId') petId: string) {
    return await this.petProxyService.findPetDto(petId);
  }

  @Post(':petId/feed')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBearerAuth('jwt-token')
  async feed(@Param('petId') petId: string) {
    return await this.petProxyService.feedAndFindReactionDto(petId);
  }

  @Post(':petId/touch')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBearerAuth('jwt-token')
  async touch(@Param('petId') petId: string) {
    return await this.petProxyService.touchAndFindReactionDto(petId);
  }

  @Patch(':petId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBody({ type: PatchPetDto })
  @ApiBearerAuth('jwt-token')
  async patch(
    @Param('petId') petId: string,
    @Body(ValidationPipe) dto: PatchPetDto,
  ) {
    await this.petProxyService.patch(petId, dto.nickName);
  }
}
