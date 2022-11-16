import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common/interfaces';

export function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Growing-SERVER API DOCS')
    .setDescription('REST API 테스트가 가능합니다.')
    .setVersion('1.0.0')
    .addTag('swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);
}
