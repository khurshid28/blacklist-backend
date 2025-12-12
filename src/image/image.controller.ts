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
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UploadService } from '../upload/upload.service';

@Controller('users/:userId/images')
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(
    private readonly imageService: ImageService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `image-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ) {
    try {
      this.logger.log(`🖼️ Rasm yuklash boshlandi - User ID: ${userId}`);
      this.logger.log(`📦 Fayl: ${file?.originalname || 'Yo\'q'}, O\'lcham: ${file?.size || 0} bytes`);
      this.logger.log(`📝 Ma\'lumotlar: ${JSON.stringify(createImageDto)}`);

      if (!file) {
        this.logger.error('❌ Fayl yuklanmadi!');
        throw new BadRequestException('Rasm fayli yuklanishi shart');
      }

      const imageUrl = this.uploadService.getFileUrl(file.filename, 'images');
      this.logger.log(`🔗 Rasm URL yaratildi: ${imageUrl}`);
      
      const result = await this.imageService.create(+userId, {
        ...createImageDto,
        url: imageUrl,
        fileSize: file.size,
      });

      this.logger.log(`✅ Rasm muvaffaqiyatli saqlandi - ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Rasm yuklashda xatolik: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.imageService.findAll(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateImageDto>) {
    return this.imageService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
