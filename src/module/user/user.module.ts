import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { S3Service } from 'src/service/S3.service';
import { UserController } from './controller/user.controller';
import { CreateUserService } from './service/create-user.service';
import { GetUserService } from './service/get-user.service';
import { UpdateUserService } from './service/update-user.service';
import { UserCodeService } from './service/user-code.service';
import { UserDBService } from './service/user-db.service';
import { UserProxyService } from './service/user-proxy.service';
import { UserS3Service } from './service/user-s3.service';

@Module({
  controllers: [UserController],
  providers: [
    UserDBService,
    UserS3Service,
    PrismaService,
    S3Service,
    UserCodeService,
    CreateUserService,
    UserProxyService,
    GetUserService,
    UpdateUserService,
  ],
  exports: [UserDBService, UserCodeService, CreateUserService],
})
export class UserModule {}
