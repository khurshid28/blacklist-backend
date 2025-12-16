import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createCommentDto: CreateCommentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
    findAll(userId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }[]>;
    findOne(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
    update(id: number, content: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
    remove(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
}
