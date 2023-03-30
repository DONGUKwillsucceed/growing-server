import { PrismaService } from 'src/service/prisma.service';
import { PostPetLineDto } from '../dto/PostPetLine.dto';
import { PetImageInterface } from '../interfaces/PetInterfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostPetService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(coupleId: string) {
    return await this.prismaService.pets
      .findMany({
        where: { coupleId, isDeleted: 1 },
        include: { PetImages: true },
      })
      .then((pets) => this.mapFromRelationForMany(pets));
  }

  async findOne(petId: string) {
    return await this.prismaService.pets
      .findUnique({
        where: { id: petId },
        include: { PetImages: true },
      })
      .then((pet) => this.mapFromRelationForOne(pet));
  }

  mapFromRelationForMany(pets: PetImageInterface[]) {
    return pets.map((pet) => {
      const dto: PostPetLineDto = {
        id: pet.id,
        imageUrl: pet.PetImages.graduateReactionUrl,
        name: pet.name,
        endedAt: pet.endedAt,
      };
      return dto;
    });
  }

  mapFromRelationForOne(pet: PetImageInterface) {
    const dto: PostPetDto = {
      id: pet.id,
      imageUrl: pet.PetImages.graduateReactionUrl,
      name: pet.name,
      createdAt: pet.createdAt,
      endedAt: pet.endedAt,
      description: pet.description,
    };
    return dto;
  }
}
