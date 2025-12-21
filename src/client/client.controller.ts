import { Controller, Get, Patch, Post, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from '../upload/upload.service';

@Controller('client')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.clientService.getProfile(req.user.id);
  }

  @Get('profile/get')
  async getProfileData(@Request() req) {
    return this.clientService.getProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateDto: UpdateClientDto) {
    return this.clientService.updateProfile(req.user.id, updateDto);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    storage: require('multer').diskStorage({
      destination: './uploads/images',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = require('path').extname(file.originalname);
        callback(null, `profile-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Only image files are allowed'), false);
      }
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const imageUrl = `/uploads/images/${file.filename}`;
    
    // Update client's image in database
    const client = await this.clientService.updateProfile(req.user.id, { image: imageUrl });
    
    return { imageUrl, client };
  }
}
