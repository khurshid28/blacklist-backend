import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    create(userId: string, createCommentDto: CreateCommentDto): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
    findAll(userId: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
    update(id: string, content: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
    remove(id: string): Promise<{
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }>;
}
