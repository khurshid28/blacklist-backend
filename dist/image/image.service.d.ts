import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
export declare class ImageService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createImageDto: CreateImageDto): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }>;
    findAll(userId: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }>;
    update(id: number, updateData: Partial<CreateImageDto>): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        description: string | null;
        url: string;
        fileSize: number | null;
    }>;
    remove(id: number): Promise<{
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
