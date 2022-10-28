import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetCareDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(petId: string, data: Prisma.PetCareUpdateInput) {
    return await this.prismaService.petCare.update({
      where: {
        id: petId,
      },
      data,
    });
  }

  async getUnique(petId: string) {
    return await this.prismaService.petCare.findUnique({
      where: {
        id: petId,
      },
    });
  }
}
