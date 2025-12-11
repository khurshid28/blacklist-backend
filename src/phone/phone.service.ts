import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';

@Injectable()
export class PhoneService {
  constructor(private prisma: PrismaService) {}

  async create(createPhoneDto: CreatePhoneDto) {
    return this.prisma.phone.create({
      data: createPhoneDto,
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.phone.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const phone = await this.prisma.phone.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!phone) {
      throw new NotFoundException(`Phone with ID ${id} not found`);
    }

    return phone;
  }

  async findByUserId(userId: number) {
    return this.prisma.phone.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, updatePhoneDto: UpdatePhoneDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.phone.update({
      where: { id },
      data: updatePhoneDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.phone.delete({
      where: { id },
    });
  }
}
