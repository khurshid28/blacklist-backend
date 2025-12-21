import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateActionDto } from './dto/create-action.dto';

@Injectable()
export class ActionService {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async createAction(clientId: number, createDto: CreateActionDto, isSuperAdmin: boolean) {
    // Only SUPER can create actions with maxCount = 0
    if (createDto.maxCount === 0 && !isSuperAdmin) {
      throw new BadRequestException('Only SUPER admins can create unlimited actions');
    }

    // Check if there's already a pending or in-progress action for this client
    const existingAction = await this.prisma.action.findFirst({
      where: {
        clientId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    });

    if (existingAction) {
      throw new BadRequestException('You already have an active action');
    }

    // Create action
    const action = await this.prisma.action.create({
      data: {
        clientId,
        startPhone: createDto.startPhone,
        maxCount: createDto.maxCount,
        status: 'PENDING',
      },
    });

    // Start processing in background
    this.processAction(action.id).catch(console.error);

    return action;
  }

  async getActions(clientId: number, isSuperAdmin: boolean) {
    const where = isSuperAdmin ? {} : { clientId };

    return this.prisma.action.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            fullname: true,
            phone: true,
          },
        },
        items: {
          include: {
            telegramUser: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAction(actionId: number, clientId: number, isSuperAdmin: boolean) {
    const action = await this.prisma.action.findUnique({
      where: { id: actionId },
      include: {
        client: {
          select: {
            id: true,
            fullname: true,
            phone: true,
          },
        },
        items: {
          include: {
            telegramUser: true,
          },
        },
      },
    });

    if (!action) {
      throw new NotFoundException('Action not found');
    }

    // Check access rights
    if (!isSuperAdmin && action.clientId !== clientId) {
      throw new BadRequestException('Access denied');
    }

    return action;
  }

  private async processAction(actionId: number) {
    try {
      console.log(`[Action ${actionId}] Starting processing...`);
      
      // Update status to IN_PROGRESS
      await this.prisma.action.update({
        where: { id: actionId },
        data: { status: 'IN_PROGRESS' },
      });
      console.log(`[Action ${actionId}] Status updated to IN_PROGRESS`);

      const action = await this.prisma.action.findUnique({
        where: { id: actionId },
      });

      if (!action) {
        console.log(`[Action ${actionId}] Action not found`);
        return;
      }

      const limit = action.maxCount === 0 ? 100 : action.maxCount;
      console.log(`[Action ${actionId}] Will query ${limit} consecutive phones starting from ${action.startPhone}`);

      // Generate sequential phone numbers from startPhone
      const startPhoneNum = parseInt(action.startPhone.replace('+998', ''));
      const phonesToProcess: string[] = [];
      
      for (let i = 0; i < limit; i++) {
        const phoneNum = startPhoneNum + i;
        const phone = `+998${phoneNum}`;
        phonesToProcess.push(phone);
      }
      
      console.log(`[Action ${actionId}] Generated ${phonesToProcess.length} phones: ${phonesToProcess[0]} to ${phonesToProcess[phonesToProcess.length - 1]}`);

      // Process each phone with random delay
      let processedCount = 0;
      for (const phone of phonesToProcess) {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`[Action ${actionId}] 📞 Processing: ${phone}`);
        
        try {
          // Check if telegram user already exists in database
          let dbTelegramUser = await this.prisma.telegramUser.findFirst({
            where: { phone },
          });
          
          if (dbTelegramUser) {
            console.log(`[Action ${actionId}] ✅ Found in database (cached)`);
            console.log(`[Action ${actionId}]    ├─ Name: ${dbTelegramUser.firstName} ${dbTelegramUser.lastName}`);
            console.log(`[Action ${actionId}]    ├─ Username: @${dbTelegramUser.username || 'none'}`);
            console.log(`[Action ${actionId}]    └─ Telegram ID: ${dbTelegramUser.telegramId}`);
            
            // Create action item with cached data
            console.log(`[Action ${actionId}] 📝 Creating action item (from cache)...`);
            await this.prisma.actionItem.create({
              data: {
                actionId: action.id,
                telegramUserId: dbTelegramUser.id,
                phone: phone,
              },
            });
            console.log(`[Action ${actionId}] ✅ Action item created`);
          } else {
            // Not in database - query Telegram API
            console.log(`[Action ${actionId}] 🔍 Not in cache, searching Telegram API...`);
            
            const telegramUserData = await this.telegramService.findByPhone(phone);
            
            if (telegramUserData) {
              console.log(`[Action ${actionId}] ✅ FOUND ON TELEGRAM!`);
              console.log(`[Action ${actionId}]    ├─ Name: ${telegramUserData.firstName} ${telegramUserData.lastName}`);
              console.log(`[Action ${actionId}]    ├─ Username: @${telegramUserData.username || 'none'}`);
              console.log(`[Action ${actionId}]    └─ Telegram ID: ${telegramUserData.telegram_id}`);
              
              // Save to database using saveOrUpdateUser
              console.log(`[Action ${actionId}] 💾 Saving to database...`);
              const savedUser = await this.telegramService.saveOrUpdateUser(telegramUserData);
              console.log(`[Action ${actionId}] ✅ Saved! DB ID: ${savedUser.id}`);
              
              // Create action item
              console.log(`[Action ${actionId}] 📝 Creating action item...`);
              await this.prisma.actionItem.create({
                data: {
                  actionId: action.id,
                  telegramUserId: savedUser.id,
                  phone: phone,
                },
              });
              console.log(`[Action ${actionId}] ✅ Action item created`);
            } else {
              console.log(`[Action ${actionId}] ❌ NOT FOUND on Telegram`);
              console.log(`[Action ${actionId}] ℹ️  Phone: ${phone} - User may not have Telegram or privacy settings enabled`);
              
              // Create action item with null telegramUserId to track this phone was checked
              console.log(`[Action ${actionId}] 📝 Creating action item (not found)...`);
              await this.prisma.actionItem.create({
                data: {
                  actionId: action.id,
                  telegramUserId: null,
                  phone: phone,
                },
              });
              console.log(`[Action ${actionId}] ✅ Action item created (marked as not found)`);
            }
          }
        } catch (error) {
          console.error(`[Action ${actionId}] ⚠️  ERROR querying phone ${phone}:`);
          console.error(`[Action ${actionId}] ⚠️  ${error.message}`);
          
          // Create action item with null to track this phone had an error
          try {
            await this.prisma.actionItem.create({
              data: {
                actionId: action.id,
                telegramUserId: null,
                phone: phone,
              },
            });
            console.log(`[Action ${actionId}] ✅ Action item created (error state)`);
          } catch (createError) {
            console.error(`[Action ${actionId}] Failed to create error action item: ${createError.message}`);
          }
        }

        // Update processed count
        await this.prisma.action.update({
          where: { id: actionId },
          data: {
            processedCount: { increment: 1 },
          },
        });
        
        processedCount++;
        console.log(`[Action ${actionId}] 📊 Progress: ${processedCount}/${limit} (${Math.round(processedCount/limit * 100)}%)`);
        
        // Random delay between 5-10 seconds (only if not the last one)
        if (processedCount < limit) {
          const delay = 5000 + Math.random() * 5000; // 5000-10000ms
          console.log(`[Action ${actionId}] ⏳ Waiting ${Math.round(delay / 1000)} seconds before next query...`);
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        }
      }

      // Mark as completed
      await this.prisma.action.update({
        where: { id: actionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
      console.log(`[Action ${actionId}] Completed successfully! Total processed: ${processedCount}`);
    } catch (error) {
      console.error(`[Action ${actionId}] Error processing action:`, error);
      await this.prisma.action.update({
        where: { id: actionId },
        data: { status: 'FAILED' },
      });
    }
  }
}
