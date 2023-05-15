import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeviceTokenDto {
  @ApiProperty({ description: 'FCM에서 받은 device token' })
  @IsString()
  token: string;
}
