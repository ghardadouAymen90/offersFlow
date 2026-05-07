'use server';

import { apiClient } from '@/lib/apiClient';
import { getAuthHeader } from '@/lib/authCookie';

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

export async function getCurrentSubscription(): Promise<Subscription | null> {
  try {
    const headers = await getAuthHeader();
    const subscription = await apiClient.get<Subscription>('/subscriptions/current', {
      headers,
      next: { tags: ['subscriptions'] },
    });
    return subscription || null;
  } catch (error) {
    console.error('Failed to fetch current subscription:', error);
    return null;
  }
}

export async function createSubscription(payload: CreateSubscriptionPayload): Promise<any> {
  try {
    const headers = await getAuthHeader();
    const response = await apiClient.post('/subscriptions', payload, {
      headers,
    });
    return response;
  } catch (error: any) {
    console.error('Failed to create subscription:', error);
    throw new Error(error?.message || 'Failed to create subscription');
  }
}

export async function cancelSubscription(): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await apiClient.delete('/subscriptions', {
      headers,
    });
  } catch (error: any) {
    console.error('Failed to cancel subscription:', error);
    throw new Error(error?.message || 'Failed to cancel subscription');
  }
}
