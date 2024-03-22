import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { FormatResponseInterceptor } from './_core/middleware/interceptor/format-response.interceptor';
import { HttpExceptionFilter } from './_core/middleware/filter/exception.filter';
import { UserModule } from './module/user/user.module';
import { PrismaModule } from './_core/prisma/prisma.module';
import { FileSystemModule } from './_core/file-system/file-system.module';
import { AccessTokenGuard } from './auth/guard/jwt-access.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, FileSystemModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
