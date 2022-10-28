import { Controller, Get, Post, Req } from '@nestjs/common';
import { UserAuthRequest } from 'src/common/interface/UserAuthRequest';
import { PetProxyService } from '../service/pet-proxy.service';

@Controller('couples/:coupleId/pets')
export class PetController {
  constructor(private readonly petProxyService: PetProxyService) {}
  @Get(':petId')
  async findUnique(@Req() req: UserAuthRequest) {
    return await this.petProxyService.findPetDto(req.params.petId);
  }

  @Post(':petId/feed')
  async feed(@Req() req: UserAuthRequest) {
    return await this.petProxyService.feedAndFindReactionDto(req.params.petId);
  }

  @Post(':petId/touch')
  async touch() {}
}
