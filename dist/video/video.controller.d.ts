import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UploadService } from '../upload/upload.service';
export declare class VideoController {
    private readonly videoService;
    private readonly uploadService;
    private readonly logger;
    constructor(videoService: VideoService, uploadService: UploadService);
    create(userId: string, file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        description: string | null;
        url: string;
        duration: number | null;
        fileSize: number | null;
    }>;
    findAll(userId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        description: string | null;
        url: string;
        duration: number | null;
        fileSize: number | null;
    }[]>;
    findOne(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        description: string | null;
        url: string;
        duration: number | null;
        fileSize: number | null;
    }>;
    update(id: string, updateData: Partial<CreateVideoDto>): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        description: string | null;
        url: string;
        duration: number | null;
        fileSize: number | null;
    }>;
    remove(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        description: string | null;
        url: string;
        duration: number | null;
        fileSize: number | null;
    }>;
}
