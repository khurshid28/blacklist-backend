import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(userId: string, createCommentDto: CreateCommentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
    findAll(userId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }[]>;
    findOne(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
    update(id: string, content: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
    remove(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        content: string;
    }>;
}
