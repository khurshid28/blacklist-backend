import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    return this.prisma.card.create({
      data: createCardDto,
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.card.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  async findByUserId(userId: number) {
    return this.prisma.card.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.card.update({
      where: { id },
      data: updateCardDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.card.delete({
      where: { id },
    });
  }
}
