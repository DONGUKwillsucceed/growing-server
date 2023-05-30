import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import { initSwagger } from './swagger';
import * as firebase from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const firebaseCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseCredentials),
  });

  app.useWebSocketAdapter(new IoAdapter(app));
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();
