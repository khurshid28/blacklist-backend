import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UploadService } from '../upload/upload.service';
export declare class ImageController {
    private readonly imageService;
    private readonly uploadService;
    private readonly logger;
    constructor(imageService: ImageService, uploadService: UploadService);
    create(userId: string, file: Express.Multer.File, createImageDto: CreateImageDto): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }>;
    findAll(userId: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }>;
    update(id: string, updateData: Partial<CreateImageDto>): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }>;
    remove(id: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }>;
}
