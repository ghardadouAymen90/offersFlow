import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('offersFlow'),
  });

  app.useGlobalPipes(new ValidationPipe());
  //Logs all HTTP requests:
  app.useGlobalInterceptors(new LoggingInterceptor());
  //Handles all exceptions with logging
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('OffersFlow API')
    .setDescription('Phone subscription offers management API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Swagger documentation at http://localhost:${port}/api`);
}

bootstrap();
