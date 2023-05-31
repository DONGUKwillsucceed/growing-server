import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface ISendFirebaseMessages {
  to: string;
  notification: {
    title?: string;
    body: string;
  };
}

@Injectable()
export class FCMService {
  logger = new Logger(FCMService.name);
  fcmURI = ' https://fcm.googleapis.com/fcm/send';
  constructor() {}

  async sendMessages(fCMs: ISendFirebaseMessages) {
    axios
      .post(this.fcmURI, fCMs, {
        headers: { Authorization: 'Bearer ' + process.env.GOOGLE_SERVER_KEY },
      })
      .then((res) =>
        this.logger.log(
          `${fCMs.notification.title}이 발송되었습니다. \n ${res}`,
        ),
      )
      .catch((err) => {
        this.logger.log(
          `${fCMs.notification.title}의 전송에 실패했습니다. \n ${err}`,
        );
        throw new Error(err);
      });
    // await firebase
    //   .messaging()
    //   .send(fCMs)
    //   .then((res) =>
    //     this.logger.log(
    //       `${fCMs.notification.title}이 발송되었습니다. \n ${res}`,
    //     ),
    //   )
    //   .catch((err) => {
    //     this.logger.log(
    //       `${fCMs.notification.title}의 전송에 실패했습니다. \n ${err}`,
    //     );
    //     throw new Error(err);
    //   });
  }

  async getToken() {
    const firebaseCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const key = JSON.parse(firebaseCredentials);
  }
}
