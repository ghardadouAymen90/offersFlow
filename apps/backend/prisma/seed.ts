import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.offer.count();

  if (!count) {
    await prisma.offer.createMany({
      data: [
        {
          title: 'Offre 1',
          price: 10,
          description: 'Appels illimités, 300 SMS',
          isForFirstSubscription: true,
          isForSwitch: false,
          isForReSubscription: false,
          advantages: ['appels illimités', '300 sms'],
        },
        {
          title: 'Offre 2',
          price: 15,
          description: 'Appels + SMS illimités',
          isForFirstSubscription: true,
          isForSwitch: true,
          isForReSubscription: true,
          advantages: ['appels illimités', 'sms illimités'],
        },
        {
          title: 'Offre 3',
          price: 20,
          description: 'Tout illimité + roaming',
          isForFirstSubscription: true,
          isForSwitch: true,
          isForReSubscription: true,
          advantages: ['appels', 'sms', 'roaming europe'],
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
