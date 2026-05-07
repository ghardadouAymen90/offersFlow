export interface Subscription {
  id: string;
  offerId: string;
  status: string;
}

export interface CreateSubscriptionPayload {
  offerId: string;
  email: string;
  address: string;
  phoneNumber: string;
  cardNumber: string;
}
