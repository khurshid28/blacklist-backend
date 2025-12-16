import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
export declare class ImageService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createImageDto: CreateImageDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        description: string | null;
        url: string;
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
        fileSize: number | null;
    }>;
    update(id: number, updateData: Partial<CreateImageDto>): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        description: string | null;
        url: string;
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
        fileSize: number | null;
    }>;
}
