import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async update(id: number, content: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async remove(id: number) {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
