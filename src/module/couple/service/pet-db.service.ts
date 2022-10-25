import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class PetDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.PetsUncheckedCreateInput) {
    return await this.prismaService.pets.create({ data });
  }
}
