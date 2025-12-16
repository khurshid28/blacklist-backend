import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';
export declare class VideoService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createVideoDto: CreateVideoDto): Promise<{
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
    findAll(userId: number): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, updateData: Partial<CreateVideoDto>): Promise<{
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
    remove(id: number): Promise<{
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
