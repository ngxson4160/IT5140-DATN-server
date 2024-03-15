import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  
  const logger = new Logger('NestApplication');

  const port = process.env.PORT;
  const url = process.env.URL;
  const prefix = process.env.PREFIX;

  app.setGlobalPrefix(prefix);

  await app.listen(port, () => {
    logger.log(`🚀 Server start at ${url}/${prefix}/${port}`);
  });
  // await app.listen(3000);
}
bootstrap();
