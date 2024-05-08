import * as path from 'path';
global.__mainDir = path.resolve(__dirname);
global.__rootDir = path.resolve(__dirname, '../..');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.enableCors();

  const logger = new Logger('NestApplication');

  const port = process.env.PORT;
  const url = process.env.URL;
  const prefix = process.env.PREFIX;

  app.setGlobalPrefix(prefix);

  app.useStaticAssets(path.join(__dirname, '../public'));

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: false,
      transform: true,
      transformOptions: {},
      validateCustomDecorators: true,
    }),
  );

  await app.listen(port || 3000, () => {
    logger.log(`🚀🚀🚀 Server start at ${url}/${prefix}/${port}`);
  });
}
bootstrap();
