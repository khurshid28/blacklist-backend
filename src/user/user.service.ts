import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        phones: true,
        cards: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        phones: true,
        cards: true,
      },
    });
  }

  async search(query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { surname: { contains: query } },
          { username: { contains: query } },
          { phone: { contains: query } },
          { pinfl: { contains: query } },
        ],
      },
      include: {
        phones: true,
        cards: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        phones: true,
        cards: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        phones: true,
        cards: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
