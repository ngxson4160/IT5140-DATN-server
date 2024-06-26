import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { FormatResponseInterceptor } from './_core/middleware/interceptor/format-response.interceptor';
import { HttpExceptionFilter } from './_core/middleware/filter/exception.filter';
import { UserModule } from './module/user/user.module';
import { AccessTokenGuard } from './auth/guard/jwt-access.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FileModule } from './file-system/file.module';
import { CompanyModule } from './module/company/company.module';
import { JobModule } from './module/job/job.module';
import { ClassTransformer } from 'class-transformer';
import { CityModule } from './module/city/city.module';
import { JobCategoryParentModule } from './module/job-category-parent/job-category-parent.module';
import { MessageModule } from './module/message/message.module';
import { NotificationModule } from './module/notification/notification.module';
import { ConversationModule } from './module/conversation/conversation.module';
import { BlogModule } from './module/blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClassTransformer,
    PrismaModule,
    UserModule,
    FileModule,
    AuthModule,
    CompanyModule,
    JobModule,
    CityModule,
    JobCategoryParentModule,
    NotificationModule,
    MessageModule,
    ConversationModule,
    BlogModule,
  ],
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
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
