import {
  Controller,
  Get,
  Req,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/user.guard';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PostPetService } from '../service/post-pet.service';
@Controller('couples/:coupleId/post-pets')
export class PostPetController {
  constructor(private readonly postPetService: PostPetService) {}

  @Get()
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
