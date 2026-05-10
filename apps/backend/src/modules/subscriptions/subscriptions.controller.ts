import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { SubscriptionsService, SubscribeResponse } from './subscriptions.service';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { Subscription, Offer } from '@prisma/client';

interface AuthRequest extends ExpressRequest {
  user: { id: string };
}

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid subscription data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async subscribe(
    @Body() payload: CreateSubscriptionDto,
    @Request() req: AuthRequest
  ): Promise<SubscribeResponse> {
    return await this.subscriptionsService.subscribe(req.user.id, payload);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({ status: 200, description: 'Current subscription details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription' })
  async getCurrentSubscription(
    @Request() req: AuthRequest
  ): Promise<(Subscription & { offer: Offer }) | null> {
    return await this.subscriptionsService.getUserSubscription(req.user.id);
  }

  @Post('request-cancellation')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Request subscription cancellation with grace period' })
  @ApiResponse({ status: 200, description: 'Cancellation requested successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No active subscription' })
  async requestCancellation(@Request() req: AuthRequest): Promise<Subscription> {
    return await this.subscriptionsService.requestCancellation(req.user.id);
  }

  @Get('suggest')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get suggested upgrade offers' })
  @ApiResponse({ status: 200, description: 'List of upgrade offers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async suggestOffer(@Request() req: AuthRequest): Promise<Offer[]> {
    return await this.subscriptionsService.suggestOffer(req.user.id);
  }

  @Post('change')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change subscription to a different offer' })
  @ApiResponse({ status: 200, description: 'Subscription changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid offer or cannot change to this offer' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changeSubscription(
    @Request() req: AuthRequest,
    @Body() body: { offerId: string }
  ): Promise<Subscription & { offer: Offer }> {
    return await this.subscriptionsService.changeSubscription(req.user.id, body.offerId);
  }
}
