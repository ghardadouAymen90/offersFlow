import { Subscription, Offer, Payment } from '@prisma/client';

export interface SubscribeResponse {
  subscription: Subscription & { offer: Offer };
  payment: Payment;
}
