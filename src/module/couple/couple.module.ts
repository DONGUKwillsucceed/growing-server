import { Module } from '@nestjs/common';
import { CoupleController } from './controller/couple.controller';
import { InitCoupleService } from './service/couple.service';

@Module({
  controllers: [CoupleController],
  providers: [InitCoupleService],
})
export class CoupleModule {}
