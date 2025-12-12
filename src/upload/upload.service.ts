import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadService {
  getMulterConfig(folder: 'videos' | 'images') {
    return {
      storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimes = folder === 'videos' 
          ? ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
          : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error(`Only ${folder} files are allowed`), false);
        }
      },
      limits: {
        fileSize: folder === 'videos' ? 100 * 1024 * 1024 : 10 * 1024 * 1024, // 100MB for videos, 10MB for images
      },
    };
  }

  getFileUrl(filename: string, folder: 'videos' | 'images'): string {
    return `http://10.166.244.136:5555/uploads/${folder}/${filename}`;
  }
}
