import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
@Injectable()
export class PetCareDBService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.PetCareUncheckedCreateInput) {
    return await this.prismaService.petCare.create({ data });
  }
}
