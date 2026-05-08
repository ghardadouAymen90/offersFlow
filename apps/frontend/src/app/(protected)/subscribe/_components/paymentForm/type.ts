export interface PaymentFormProps {
  offerId: string;
  offerTitle: string;
  offerPrice: number;
  userEmail: string;
  onSuccess(): void;
  onError(error: string): void;
}
