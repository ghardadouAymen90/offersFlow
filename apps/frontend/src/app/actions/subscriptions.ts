'use server';

import { apiClient } from '@/lib/apiClient';
import { getAuthHeader } from '@/lib/authCookie';
import { CreateSubscriptionPayload, Subscription } from '@/types/subscription';

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

export async function requestCancellation(): Promise<Subscription> {
  try {
    const headers = await getAuthHeader();
    const response = await apiClient.post<Subscription>('/subscriptions/request-cancellation', {}, {
      headers,
    });
    return response;
  } catch (error: any) {
    console.error('Failed to request cancellation:', error);
    throw new Error(error?.message || 'Failed to request cancellation');
  }
}

export async function confirmCancellation(): Promise<Subscription> {
  try {
    const headers = await getAuthHeader();
    const response = await apiClient.post<Subscription>('/subscriptions/confirm-cancellation', {}, {
      headers,
    });
    return response;
  } catch (error: any) {
    console.error('Failed to confirm cancellation:', error);
    throw new Error(error?.message || 'Failed to confirm cancellation');
  }
}

export async function requestSuggestedOffers(): Promise<any[]> {
  try {
    const headers = await getAuthHeader();
    const offers = await apiClient.get<any[]>('/subscriptions/suggest', {
      headers,
      next: { tags: ['subscriptions'] },
    });
    return offers || [];
  } catch (error) {
    console.error('Failed to fetch suggested offers:', error);
    return [];
  }
}

export async function quickChangeSubscription(newOfferId: string): Promise<any> {
  try {
    const headers = await getAuthHeader();
    const response = await apiClient.post('/subscriptions/change', 
      { offerId: newOfferId },
      { headers }
    );
    return response;
  } catch (error: any) {
    console.error('Failed to change subscription:', error);
    throw new Error(error?.message || 'Failed to change subscription');
  }
}

export async function changeSubscription(newOfferId: string, paymentData: CreateSubscriptionPayload): Promise<any> {
  try {
    const headers = await getAuthHeader();
    
    await apiClient.delete('/subscriptions', { headers });
    
    const response = await apiClient.post('/subscriptions', 
      { ...paymentData, offerId: newOfferId },
      { headers }
    );
    
    return response;
  } catch (error: any) {
    console.error('Failed to change subscription:', error);
    throw new Error(error?.message || 'Failed to change subscription');
  }
}
