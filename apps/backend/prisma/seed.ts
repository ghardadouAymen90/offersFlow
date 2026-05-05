import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.offer.count();

  if (!count) {
    await prisma.offer.createMany({
      data: [
        {
          title: 'Standard Plan',
          price: 10,
          description: 'Appels illimités, 300 SMS',
          minutes: 'Unlimited',
          texts: '300',
          data: '5GB',
          isForFirstSubscription: true,
          isForSwitch: false,
          isForReSubscription: false,
          advantages: ['appels illimités', '300 sms'],
        },
        {
          title: 'Premium Plan',
          price: 15,
          description: 'Appels + SMS illimités',
          minutes: 'Unlimited',
          texts: 'Unlimited',
          data: '20GB',
          isForFirstSubscription: true,
          isForSwitch: true,
          isForReSubscription: true,
          advantages: ['appels illimités', 'sms illimités'],
        },
        {
          title: 'Elite Plan',
          price: 20,
          description: 'Tout illimité + roaming',
          minutes: 'Unlimited',
          texts: 'Unlimited',
          data: 'Unlimited',
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
