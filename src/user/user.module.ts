import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './public/uploads',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
