import { IsString } from 'class-validator';
import { ClaimType } from 'src/common/interface/AuthRequest';

export class RefreshTokenDto {
  @IsString()
  userId: string;
}

export class CreateJWTDto {
  uid: string | undefined;
  type: ClaimType | undefined;
}
