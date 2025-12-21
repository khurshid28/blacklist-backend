import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async getProfile(clientId: number) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        fullname: true,
        phone: true,
        image: true,
        role: true,
        workStatus: true,
        createdAt: true,
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async updateProfile(clientId: number, updateDto: UpdateClientDto) {
    const updateData: any = {};

    if (updateDto.fullname) {
      updateData.fullname = updateDto.fullname;
    }

    if (updateDto.image !== undefined) {
      updateData.image = updateDto.image;
    }

    if (updateDto.password) {
      updateData.password = await bcrypt.hash(updateDto.password, 10);
    }

    const client = await this.prisma.client.update({
      where: { id: clientId },
      data: updateData,
      select: {
        id: true,
        fullname: true,
        phone: true,
        image: true,
        role: true,
        workStatus: true,
      },
    });

    return client;
  }
}
