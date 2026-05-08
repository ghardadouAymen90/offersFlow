'use server';

import { apiClient } from '@/lib/apiClient';
import { getAuthHeader } from '@/lib/authCookie';
import { Offer } from '@/types/offer';

export async function fetchOffers(): Promise<Offer[]> {
  try {
    const headers = await getAuthHeader();
    const offers = await apiClient.get<Offer[]>('/offers', {
      headers,
      next: { tags: ['offers'], revalidate: 60 }
    });
    return offers;
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}
