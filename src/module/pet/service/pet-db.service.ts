import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class PetDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(petId: string) {
    return await this.prismaService.pets.findFirst({
      where: {
        id: petId,
        endedAt: null,
      },
      include: {
        PetCare: true,
        PetImages: true,
      },
    });
  }

  async increaseOneHungryGauge(petId: string) {
    return await this.prismaService.pets.update({
      where: {
        id: petId,
      },
      data: {
        hungryGauge: {
          increment: 2,
        },
      },
    });
  }

  async decreaseOneHungryGuage(petId: string) {
    return await this.prismaService.pets.update({
      where: {
        id: petId,
      },
      data: {
        hungryGauge: {
          decrement: 2,
        },
      },
    });
  }
}
