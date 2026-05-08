import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('offersFlow'),
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Backend running on http://localhost:${port}`);
}

bootstrap();
