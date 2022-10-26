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
}
