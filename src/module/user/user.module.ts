import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { UserController } from './controller/user.controller';
import { UserCodeService } from './service/user-code.service';
import { UserDBService } from './service/user-db.service';
import { UserMapperService } from './service/user-map.service';
import { UserS3Service } from './service/user-s3.service';
import { UserService } from './service/user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserDBService,
    UserMapperService,
    UserS3Service,
    PrismaService,
    S3Service,
    UserCodeService,
  ],
  exports: [],
})
export class UserModule {}
