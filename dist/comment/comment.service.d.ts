import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createCommentDto: CreateCommentDto): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
    findAll(userId: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
    update(id: number, content: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
}
