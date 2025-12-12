import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `user-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📥 CREATE USER REQUEST:', {
      body: createUserDto,
      file: file ? { filename: file.filename, mimetype: file.mimetype } : null,
    });
    
    // Convert string booleans from FormData to actual booleans
    if (typeof createUserDto.gender === 'string') {
      (createUserDto as any).gender = createUserDto.gender === 'true';
    }
    if (typeof createUserDto.sudlangan === 'string') {
      (createUserDto as any).sudlangan = createUserDto.sudlangan === 'true';
    }
    
    if (file) {
      createUserDto.image = `/uploads/${file.filename}`;
    }
    
    console.log('✅ PROCESSED DATA:', createUserDto);
    
    try {
      const result = await this.userService.create(createUserDto);
      console.log('✅ USER CREATED:', result);
      return result;
    } catch (error) {
      console.error('❌ CREATE USER ERROR:', error);
      throw error;
    }
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.userService.search(query);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `user-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📥 UPDATE USER REQUEST:', {
      id,
      body: updateUserDto,
      file: file ? { filename: file.filename, mimetype: file.mimetype } : null,
    });
    
    const updateData: any = { ...updateUserDto };
    
    // Convert string booleans from FormData to actual booleans
    if (updateData.gender !== undefined) {
      updateData.gender = updateData.gender === 'true' || updateData.gender === true;
    }
    if (updateData.sudlangan !== undefined) {
      updateData.sudlangan = updateData.sudlangan === 'true' || updateData.sudlangan === true;
    }
    
    if (file) {
      updateData.image = `/uploads/${file.filename}`;
    }
    
    console.log('✅ PROCESSED UPDATE DATA:', updateData);
    
    try {
      const result = await this.userService.update(id, updateData);
      console.log('✅ USER UPDATED:', result);
      return result;
    } catch (error) {
      console.error('❌ UPDATE USER ERROR:', error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // Sheriklar (Partners) endpoints
  @Post(':id/partners')
  addPartners(
    @Param('id', ParseIntPipe) userId: number,
    @Body('partnerIds') partnerIds: number[],
  ) {
    return this.userService.addPartners(userId, partnerIds);
  }

  @Get(':id/partners')
  getPartners(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getPartners(userId);
  }

  @Delete(':id/partners/:partnerId')
  removePartner(
    @Param('id', ParseIntPipe) userId: number,
    @Param('partnerId', ParseIntPipe) partnerId: number,
  ) {
    return this.userService.removePartner(userId, partnerId);
  }
}
