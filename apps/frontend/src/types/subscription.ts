import { Offer } from './offer';

export interface Subscription {
  id: string;
  offerId: string;
  status: string;
  offer?: Offer;
  soldPrice?: number;
  cancellationRequestedAt?: string | Date;
  gracePeriodEndAt?: string | Date;
}

export interface CreateSubscriptionPayload {
  offerId: string;
  email: string;
  address: string;
  phoneNumber: string;
  cardNumber: string;
}
