'use server';

import { apiClient } from '@/lib/apiClient';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  minutes: number | string;
  texts: number | string;
  data: string;
}

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const offers = await apiClient.get<Offer[]>('/offers', {
      next: { tags: ['offers'], revalidate: 60 }
    });
    return offers;
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}
