import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { FormatResponseInterceptor } from './_core/middleware/intercepter/format-response.interceptor';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './_core/middleware/filter/exception.filter';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ],
})
export class AppModule {}
