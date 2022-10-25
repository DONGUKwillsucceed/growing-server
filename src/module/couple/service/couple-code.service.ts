import { CoupleDBService } from './couple-db.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CoupleCodeService {
  private characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(private readonly coupleDBService: CoupleDBService) {}

  async generateOne() {
    let code: string;
    while (true) {
      code = this.makeString();
      if (!(await this.isOverlapped(code))) {
        break;
      }
    }
    return code;
  }

  async verify(code: string) {
    return await this.coupleDBService.findOneWithCode(code);
  }

  private makeString() {
    let result = '';
    const charactersLength = this.characters.length;
    for (let i = 0; i < 10; i++) {
      result += this.characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }
    return result;
  }

  private async isOverlapped(code: string) {
    return !!(await this.coupleDBService.findOneWithCode(code));
  }
}
