import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PhoneModule } from './phone/phone.module';
import { CardModule } from './card/card.module';
import { TelegramModule } from './telegram/telegram.module';
import { CommentModule } from './comment/comment.module';
import { VideoModule } from './video/video.module';
import { ImageModule } from './image/image.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UploadModule,
    UserModule,
    PhoneModule,
    CardModule,
    TelegramModule,
    CommentModule,
    VideoModule,
    ImageModule,
  ],
})
export class AppModule {}
