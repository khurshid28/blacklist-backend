import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createImageDto: CreateImageDto) {
    if (!createImageDto.url) {
      throw new BadRequestException('Rasm URL majburiy');
    }

    return this.prisma.image.create({
      data: {
        userId,
        url: createImageDto.url,
        title: createImageDto.title,
        description: createImageDto.description,
        fileSize: createImageDto.fileSize,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.image.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.image.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateData: Partial<CreateImageDto>) {
    return this.prisma.image.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.image.delete({
      where: { id },
    });
  }
}
