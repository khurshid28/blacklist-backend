import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createVideoDto: CreateVideoDto) {
    if (!createVideoDto.url) {
      throw new BadRequestException('Video URL majburiy');
    }

    return this.prisma.video.create({
      data: {
        userId,
        url: createVideoDto.url,
        title: createVideoDto.title,
        description: createVideoDto.description,
        duration: createVideoDto.duration,
        fileSize: createVideoDto.fileSize,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.video.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateData: Partial<CreateVideoDto>) {
    return this.prisma.video.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.video.delete({
      where: { id },
    });
  }
}
