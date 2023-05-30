import { Injectable, Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
}

@Injectable()
export class FCMService {
  logger = new Logger(FCMService.name);
  constructor() {
    // For simplicity these credentials are just stored in the environment
    // However these should be stored in a key management system
  }

  async sendMessages(fCMs: ISendFirebaseMessages) {
    await firebase
      .messaging()
      .send(fCMs)
      .then((res) =>
        this.logger.log(`${fCMs.title}이 발송되었습니다. \n ${res}`),
      )
      .catch((err) => {
        this.logger.log(`${fCMs.title}의 전송에 실패했습니다. \n ${err}`);
        throw new Error(err);
      });
  }
}
