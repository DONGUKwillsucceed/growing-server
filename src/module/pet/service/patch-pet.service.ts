import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class PatchPetService {
  constructor(private readonly prisamService: PrismaService) {}

  async patch(petId: string, name: string) {
    const pet = await this.prisamService.pets.findUnique({
      where: { id: petId },
    });
    const result = { result: false };
    if (pet.isNameChanged) return result;

    await this.prisamService.pets.update({
      where: { id: petId },
      data: { name, isNameChanged: 1 },
    });

    return (result.result = true);
  }

  async graduate(petId: string) {
    return await this.prisamService.pets.update({
      where: { id: petId },
      data: {
        isDeleted: 1,
        endedAt: new Date(),
      },
    });
  }
}
