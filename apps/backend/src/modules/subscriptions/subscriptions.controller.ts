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

  @Post('request-cancellation')
  @UseGuards(JwtAuthGuard)
  async requestCancellation(@Request() req: AuthRequest): Promise<Subscription> {
    return await this.subscriptionsService.requestCancellation(req.user.id);
  }

  @Get('suggest')
  @UseGuards(JwtAuthGuard)
  async suggestOffer(@Request() req: AuthRequest): Promise<Offer[]> {
    return await this.subscriptionsService.suggestOffer(req.user.id);
  }

  @Post('change')
  @UseGuards(JwtAuthGuard)
  async changeSubscription(
    @Request() req: AuthRequest,
    @Body() body: { offerId: string }
  ): Promise<Subscription & { offer: Offer }> {
    return await this.subscriptionsService.changeSubscription(req.user.id, body.offerId);
  }
}
