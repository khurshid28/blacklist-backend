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
  Logger,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UploadService } from '../upload/upload.service';

@Controller('users/:userId/videos')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);

  constructor(
    private readonly videoService: VideoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `video-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    try {
      this.logger.log(`📹 Video yuklash boshlandi - User ID: ${userId}`);
      this.logger.log(`📦 Fayl: ${file?.originalname || 'Yo\'q'}, O\'lcham: ${file?.size || 0} bytes`);
      this.logger.log(`📝 Ma\'lumotlar: ${JSON.stringify(createVideoDto)}`);

      if (!file) {
        this.logger.error('❌ Fayl yuklanmadi!');
        throw new BadRequestException('Video fayli yuklanishi shart');
      }

      const videoUrl = this.uploadService.getFileUrl(file.filename, 'videos');
      this.logger.log(`🔗 Video URL yaratildi: ${videoUrl}`);
      
      const result = await this.videoService.create(+userId, {
        ...createVideoDto,
        url: videoUrl,
        fileSize: file.size,
      });

      this.logger.log(`✅ Video muvaffaqiyatli saqlandi - ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Video yuklashda xatolik: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.videoService.findAll(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateVideoDto>) {
    return this.videoService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
