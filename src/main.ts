import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://bobaprint-app.web.app/',
      'https://app.bobaprint.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  initSwagger(app)
  await app.listen(3000);
}
bootstrap();
