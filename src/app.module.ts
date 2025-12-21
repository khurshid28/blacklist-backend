import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PhoneModule } from './phone/phone.module';
import { CardModule } from './card/card.module';
import { TelegramModule } from './telegram/telegram.module';
import { CommentModule } from './comment/comment.module';
import { VideoModule } from './video/video.module';
import { ImageModule } from './image/image.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { ActionModule } from './action/action.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ClientModule,
    ActionModule,
    UploadModule,
    UserModule,
    PhoneModule,
    CardModule,
    TelegramModule,
    CommentModule,
    VideoModule,
    ImageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule {}
