import { Controller, Post, Get, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { SubscriptionsService, SubscribeResponse } from './subscriptions.service';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { Subscription, Offer } from '@prisma/client';

interface AuthRequest extends ExpressRequest {
  user: { id: string };
}

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @Body() payload: CreateSubscriptionDto,
    @Request() req: AuthRequest
  ): Promise<SubscribeResponse> {
    return await this.subscriptionsService.subscribe(req.user.id, payload);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentSubscription(
    @Request() req: AuthRequest
  ): Promise<(Subscription & { offer: Offer }) | null> {
    return await this.subscriptionsService.getUserSubscription(req.user.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Request() req: AuthRequest): Promise<Subscription> {
    return await this.subscriptionsService.cancelSubscription(req.user.id);
  }
}
