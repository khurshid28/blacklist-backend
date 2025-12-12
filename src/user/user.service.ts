import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { telegramUserId, ...userData } = createUserDto;
    
    // Create user
    const user = await this.prisma.user.create({
      data: userData,
      include: {
        phones: true,
        cards: true,
        telegramUser: true,
      },
    });

    // Connect TelegramUser if provided
    if (telegramUserId) {
      try {
        await this.prisma.telegramUser.update({
          where: { id: telegramUserId },
          data: { userId: user.id },
        });
        console.log(`✅ Connected TelegramUser ${telegramUserId} to User ${user.id}`);
        
        // Refetch user with telegramUser data
        const updatedUser = await this.prisma.user.findUnique({
          where: { id: user.id },
          include: {
            phones: true,
            cards: true,
            telegramUser: true,
          },
        });
        return updatedUser;
      } catch (error) {
        console.error(`❌ Failed to connect TelegramUser ${telegramUserId}:`, error.message);
      }
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        phones: true,
        cards: true,
        telegramUser: true,
        partners: {
          select: {
            id: true,
            userId: true,
            partnerId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        videos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        images: {
          orderBy: {
            createdAt: 'desc',
          },
        },
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
        telegramUser: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        phones: true,
        cards: true,
        telegramUser: true,
        partners: {
          include: {
            partner: {
              include: {
                phones: true,
                cards: true,
                telegramUser: true,
              },
            },
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        videos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        images: {
          orderBy: {
            createdAt: 'desc',
          },
        },
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

  // Sheriklar (Partners) methods
  async addPartners(userId: number, partnerIds: number[]) {
    await this.findOne(userId); // Check if user exists

    // Filter out invalid partner IDs (user can't be their own partner)
    const validPartnerIds = partnerIds.filter(partnerId => partnerId !== userId);

    // Create bidirectional partner relations (ikkala tarafga ham qo'shish)
    const createPromises = [];
    
    for (const partnerId of validPartnerIds) {
      // userId -> partnerId relation
      createPromises.push(
        this.prisma.userPartner.upsert({
          where: {
            userId_partnerId: {
              userId,
              partnerId,
            },
          },
          create: {
            userId,
            partnerId,
          },
          update: {}, // Already exists, do nothing
        }),
      );
      
      // partnerId -> userId relation (o'zaro bog'lanish)
      createPromises.push(
        this.prisma.userPartner.upsert({
          where: {
            userId_partnerId: {
              userId: partnerId,
              partnerId: userId,
            },
          },
          create: {
            userId: partnerId,
            partnerId: userId,
          },
          update: {}, // Already exists, do nothing
        }),
      );
    }

    await Promise.all(createPromises);

    return this.getPartners(userId);
  }

  async getPartners(userId: number) {
    const userWithPartners = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        partners: {
          include: {
            partner: {
              include: {
                phones: true,
                cards: true,
                telegramUser: true,
              },
            },
          },
        },
      },
    });

    if (!userWithPartners) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Return just the partners array with simplified structure
    return userWithPartners.partners.map(up => ({
      id: up.id,
      partnerId: up.partnerId,
      createdAt: up.createdAt,
      partner: up.partner,
    }));
  }

  async removePartner(userId: number, partnerId: number) {
    // Remove bidirectional partnership in a transaction for consistency
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Delete userId -> partnerId relationship
        const deleted1 = await prisma.userPartner.deleteMany({
          where: {
            userId,
            partnerId,
          },
        });

        // Delete partnerId -> userId relationship (mutual removal)
        const deleted2 = await prisma.userPartner.deleteMany({
          where: {
            userId: partnerId,
            partnerId: userId,
          },
        });

        return {
          userToPartner: deleted1.count,
          partnerToUser: deleted2.count,
        };
      });

      console.log(
        `✅ Partnership removed: User ${userId} ↔ Partner ${partnerId}`,
        `(Deleted: ${result.userToPartner + result.partnerToUser} relations)`,
      );

      return {
        message: 'Partnership removed successfully from both sides',
        details: result,
      };
    } catch (error) {
      console.error(`❌ Failed to remove partnership: ${error.message}`);
      throw error;
    }
  }
}