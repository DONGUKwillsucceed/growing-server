import {
  Controller,
  Get,
  Req,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PostPetService } from '../service/post-pet.service';
@Controller('couples/:coupleId/post-pets')
export class PostPetController {
  constructor(private readonly postPetService: PostPetService) {}

  @Get()
  @ApiParam({ name: 'coupleId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findMany(@Req() req: UserAuthRequest) {
    try {
      const coupleId = req.params.coupleId;
      return await this.postPetService.findMany(coupleId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }

  @Get(':petId')
  @ApiParam({ name: 'coupleId', required: true })
  @ApiParam({ name: 'petId', required: true })
  @ApiBearerAuth('jwt-token')
  @UseGuards(UserAuthGuard)
  async findOne(@Req() req: UserAuthRequest) {
    try {
      const petId = req.params.petId;
      return await this.postPetService.findOne(petId);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Server error');
    }
  }
}
