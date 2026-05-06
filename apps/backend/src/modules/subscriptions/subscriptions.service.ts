import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSubscriptionDto } from './create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async subscribe(userId: string, payload: CreateSubscriptionDto) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: payload.offerId },
    });

    if (!offer) {
      throw new BadRequestException('Offer not found');
    }

    const currentSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: { offer: true },
    });

    await this.validateSubscription(userId, offer, currentSubscription);

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        offerId: payload.offerId,
        status: 'ACTIVE',
      },
      include: { offer: true },
    });

    const cardLastFour = payload.cardNumber.slice(-4);
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        email: payload.email,
        address: payload.address,
        phoneNumber: payload.phoneNumber,
        cardLastFour,
      },
    });

    return { subscription, payment };
  }

  private async validateSubscription(userId: string, offer: any, currentSubscription: any) {
    if (currentSubscription) {
      throw new BadRequestException(
        'User already has an active subscription. Use the change subscription endpoint instead.'
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: { orderBy: { createdAt: 'desc' } } },
    });

    const lastSubscription = user?.subscriptions?.[0];

    if (lastSubscription?.offerId === offer.id) {
      throw new BadRequestException(
        'Cannot subscribe to the same offer consecutively. Choose a different offer.'
      );
    }

    if (offer.isForFirstSubscription && lastSubscription) {
      throw new BadRequestException(
        `This offer (${offer.title}) is only available for first subscription.`
      );
    }

    if (!offer.isForSwitch && lastSubscription && lastSubscription.status === 'ACTIVE') {
      throw new BadRequestException(
        `This offer (${offer.title}) is not available for switching from another offer.`
      );
    }

    if (lastSubscription?.status === 'CANCELLED') {
      if (!offer.isForReSubscription) {
        throw new BadRequestException(
          `This offer (${offer.title}) is not available for resubscription after cancellation.`
        );
      }
    }
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    if (!subscription) {
      throw new BadRequestException('No active subscription found');
    }

    return await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        endedAt: new Date(),
      },
    });
  }

  async getUserSubscription(userId: string) {
    return await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: { offer: true },
    });
  }

  async changeSubscription(userId: string, newOfferId: string) {
    const currentSubscription = await this.cancelSubscription(userId);
    return currentSubscription;
  }
}
