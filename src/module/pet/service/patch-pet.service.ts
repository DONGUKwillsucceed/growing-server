import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class PatchPetService {
  constructor(private readonly prisamService: PrismaService) {}

  async patch(petId: string, name: string) {
    await this.prisamService.pets.update({
      where: { id: petId },
      data: { name },
    });
  }
}
