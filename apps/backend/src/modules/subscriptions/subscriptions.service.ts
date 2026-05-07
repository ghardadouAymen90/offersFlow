import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { Subscription, Offer, Payment, SubscriptionStatus } from '@prisma/client';

export interface SubscribeResponse {
  subscription: Subscription & { offer: Offer };
  payment: Payment;
}

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async subscribe(userId: string, payload: CreateSubscriptionDto): Promise<SubscribeResponse> {
    const offer = await this.prisma.offer.findUnique({
      where: { id: payload.offerId },
    });

    if (!offer) {
      throw new BadRequestException('Offer not found');
    }

    const currentSubscription = await this.getUserSubscription(userId);

    await this.validateSubscription(
      userId,
      offer,
      currentSubscription as (Subscription & { offer: Offer }) | null
    );

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        offerId: payload.offerId,
        status: SubscriptionStatus.ACTIVE,
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

  private async validateSubscription(
    userId: string,
    offer: Offer,
    currentSubscription: (Subscription & { offer: Offer }) | null
  ): Promise<void> {
    // validation de la subscription et re-subscription (et non pas le switch d'abonnement)
    if (currentSubscription) {
      throw new BadRequestException(
        'User already has an active subscription. Change subscription instead.'
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: { orderBy: { createdAt: 'desc' } } },
    });

    const [lastSubscription] = user?.subscriptions ?? [];
    if (lastSubscription?.status !== SubscriptionStatus.ACTIVE) {
      if (!offer.isForReSubscription) {
        throw new BadRequestException(
          `This offer (${offer.title}) is not available for resubscription after cancellation.`
        );
      }
    }
  }

  async cancelSubscription(userId: string): Promise<Subscription> {

    await this.prisma.subscription.deleteMany({
      where: {
        userId,
        status: SubscriptionStatus.CANCELLED,
      },
    });

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (subscription?.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('No active subscription to cancel');
    }

    return await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        endedAt: new Date(),
      },
    });
  }

  async getUserSubscription(userId: string): Promise<(Subscription & { offer: Offer }) | null> {
    return await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      include: { offer: true },
    });
  }

  async changeSubscription(userId: string, newOfferId: string): Promise<Subscription> {
    const currentSubscription = await this.cancelSubscription(userId);
    return currentSubscription;
  }
}
