import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PetImageDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUnique(id: string) {
    return await this.prismaService.petImages.findUnique({
      where: {
        id,
      },
    });
  }
}
