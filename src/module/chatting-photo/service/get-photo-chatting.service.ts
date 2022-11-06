// import { Injectable } from '@nestjs/common';
// import { Photos } from '@prisma/client';
// import { PrismaService } from 'src/service/prisma.service';
// import { S3Service } from 'src/service/S3.service';
// import { PhotoLineDto } from '../dto/PhotoLine.dto';
// import { Where } from '../types/Where.enum';
// @Injectable()
// export class GetPhotoChattingService {
//   constructor(
//     private readonly prismaService: PrismaService,
//     private readonly s3Service: S3Service,
//   ) {}
//   async findMany(coupleId: string) {
//     this.getManyForChatting(coupleId)
//       .then((photos) => this.getImageUrl(photos))
//       .then((photos) => this.mapFromRelationForLineDto(photos));
//   }

//   private async getManyForChatting(coupleId: string) {
//     return await this.prismaService.chattings.findMany({
//       where: {
//         coupleId,
//       },
//       include: {
//         Chatting_Photo: {
//           include: {
//             Photos: true,
//           },
//         },
//       },
//     });
//   }

//   private async getImageUrl(photos: Photos[]) {
//     return await Promise.all(
//       photos.map(async (photo) => {
//         const s3Url = new URL(photo.s3Path);
//         const imageUrl = await this.s3Service.getObjectUrl(s3Url);
//         return { imageUrl, ...photo };
//       }),
//     );
//   }

//   private mapFromRelationForLineDto(photos: Photos[]) {
//     return photos.map((photo) => {
//       const dto: PhotoLineDto = {
//         i: photo.id,
//         u: photo.s3Path,
//         c: photo.coupleId,
//       };
//       return dto;
//     });
//   }
// }
