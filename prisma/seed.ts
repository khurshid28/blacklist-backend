import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create SUPER admin
  const hashedPassword = await bcrypt.hash('123456', 10);

  const superAdmin = await prisma.client.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      fullname: 'Super Admin',
      phone: '+998901234567',
      password: hashedPassword,
      role: 'SUPER',
      workStatus: 'ACTIVE',
    },
  });

  console.log('✅ Super Admin created:', superAdmin);

  // Create regular client
  const regularClient = await prisma.client.upsert({
    where: { phone: '+998901111111' },
    update: {},
    create: {
      fullname: 'Test Client',
      phone: '+998901111111',
      password: hashedPassword,
      role: 'CLIENT',
      workStatus: 'ACTIVE',
    },
  });

  console.log('✅ Regular Client created:', regularClient);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
