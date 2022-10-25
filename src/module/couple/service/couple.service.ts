import { PrismaService } from 'src/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCoupleAndPetDto } from '../dto/CreateCoupleAndPet.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class InitCoupleService {
  constructor(private readonly prismaService: PrismaService) {}

  async initCouple(dto: CreateCoupleAndPetDto) {}

  async createCoupleRecord(data: Prisma.CouplesUncheckedCreateInput) {
    await this.prismaService.couples.create({
      data,
    });
  }

  async createPetRecord(data: Prisma.PetsUncheckedCreateInput) {
    await this.prismaService.pets.create({
      data,
    });
  }

  async createPetCareRecord(data: Prisma.PetCareUncheckedCreateInput) {
    await this.prismaService.petCare.create({
      data,
    });
  }

  createPetCareData() {
    const data: Prisma.PetCareUncheckedCreateInput = {
      id: uuidv4(),
    };
    return data;
  }

  createCoupleData(dto: CreateCoupleAndPetDto, code: string) {
    const data: Prisma.CouplesUncheckedCreateInput = {
      id: uuidv4(),
      anniversaryDay: dto.anniversaryDay,
      verificationCode: code,
    };
    return data;
  }

  createPetData(dto: CreateCoupleAndPetDto, coupleId: string, careId: string) {
    const data: Prisma.PetsUncheckedCreateInput = {
      id: uuidv4(),
      coupleId,
      name: dto.petName,
      petImageId: '',
      careId,
    };
    return data;
  }
}
