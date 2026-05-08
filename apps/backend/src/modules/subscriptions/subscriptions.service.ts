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
        soldPrice: offer.price,
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
        status: {
          in: [SubscriptionStatus.CANCELLED, SubscriptionStatus.CANCELLATION_PENDING],
        },
      },
    });

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (!subscription) {
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

  async requestCancellation(userId: string): Promise<Subscription> {
    await this.prisma.subscription.deleteMany({
      where: {
        userId,
        status: {
          in: [SubscriptionStatus.CANCELLED, SubscriptionStatus.CANCELLATION_PENDING],
        },
      },
    });

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (!subscription) {
      throw new BadRequestException('No active subscription to cancel');
    }

    const gracePeriodEndAt = new Date();
    gracePeriodEndAt.setMonth(gracePeriodEndAt.getMonth() + 1);

    return await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLATION_PENDING,
        cancellationRequestedAt: new Date(),
        endedAt: gracePeriodEndAt,
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

  async changeSubscription(
    userId: string,
    newOfferId: string
  ): Promise<Subscription & { offer: Offer }> {
    const currentSubscription = await this.getUserSubscription(userId);
    if (!currentSubscription) {
      throw new BadRequestException('No active subscription to change');
    }

    const newOffer = await this.prisma.offer.findUnique({
      where: { id: newOfferId },
    });
    if (!newOffer) {
      throw new BadRequestException('New offer not found');
    }

    const currentPayment = await this.prisma.payment.findFirst({
      where: { subscriptionId: currentSubscription.id },
    });

    await this.cancelSubscription(userId);

    const newSubscription = await this.prisma.subscription.create({
      data: {
        userId,
        offerId: newOfferId,
        status: SubscriptionStatus.ACTIVE,
        soldPrice: newOffer.price,
      },
      include: { offer: true },
    });

    if (currentPayment) {
      await this.prisma.payment.create({
        data: {
          userId,
          subscriptionId: newSubscription.id,
          email: currentPayment.email,
          address: currentPayment.address,
          phoneNumber: currentPayment.phoneNumber,
          cardLastFour: currentPayment.cardLastFour,
        },
      });
    }

    return newSubscription;
  }

  async suggestOffer(userId: string): Promise<Offer[]> {
    const currentSubscription = await this.getUserSubscription(userId);

    if (!currentSubscription) {
      return [];
    }

    const allSuggestedOffers = await this.prisma.offer.findMany({
      where: {
        price: {
          gt: currentSubscription.offer.price,
        },
      },
      orderBy: { price: 'asc' },
    });

    return allSuggestedOffers;
  }
}
