import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { SubscriptionStatus } from '@prisma/client';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let prismaService: PrismaService;

  const mockOffer = {
    id: 'offer-123',
    title: 'Premium Plan',
    description: 'Premium subscription',
    price: 99,
    minutes: '100',
    texts: '1000',
    data: '10GB',
    isForFirstSubscription: false,
    isForSwitch: true,
    isForReSubscription: true,
    advantages: {},
    createdAt: new Date(),
  };

  const mockSubscription = {
    id: 'sub-123',
    userId: 'user-123',
    offerId: 'offer-123',
    status: SubscriptionStatus.ACTIVE,
    soldPrice: 99,
    createdAt: new Date(),
    updatedAt: new Date(),
    startedAt: new Date(),
    endedAt: null,
    cancellationRequestedAt: null,
    gracePeriodEndAt: null,
    offer: mockOffer,
  };

  const mockPayment = {
    id: 'payment-123',
    userId: 'user-123',
    subscriptionId: 'sub-123',
    email: 'test@example.com',
    address: '123 Main St',
    phoneNumber: '1234567890',
    cardLastFour: '1234',
    createdAt: new Date(),
    updatedAt: new Date(),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: PrismaService,
          useValue: {
            offer: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
            subscription: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              deleteMany: jest.fn(),
            },
            payment: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should create a new subscription successfully', async () => {
      const createDto: CreateSubscriptionDto = {
        offerId: 'offer-123',
        email: 'test@example.com',
        address: '123 Main St',
        phoneNumber: '1234567890',
        cardNumber: '4111111111111234',
      };

      jest.spyOn(prismaService.offer, 'findUnique').mockResolvedValue(mockOffer);
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 'user-123',
        fullName: 'Test User',
        gender: 'MALE',
        age: 25,
        email: 'test@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      jest.spyOn(prismaService.subscription, 'create').mockResolvedValue(mockSubscription);
      jest.spyOn(prismaService.payment, 'create').mockResolvedValue(mockPayment);

      const result = await service.subscribe('user-123', createDto);

      expect(result).toHaveProperty('subscription');
      expect(result).toHaveProperty('payment');
      expect(result.subscription.offerId).toBe(createDto.offerId);
      expect(result.payment.cardLastFour).toBe('1234');
      expect(result.subscription.soldPrice).toBe(99);
    });

    it('should throw BadRequestException if offer not found', async () => {
      const createDto: CreateSubscriptionDto = {
        offerId: 'invalid-offer',
        email: 'test@example.com',
        address: '123 Main St',
        phoneNumber: '1234567890',
        cardNumber: '4111111111111234',
      };

      jest.spyOn(prismaService.offer, 'findUnique').mockResolvedValue(null);

      await expect(service.subscribe('user-123', createDto)).rejects.toThrow(
        new BadRequestException('Offer not found')
      );
    });

    it('should throw BadRequestException if user already has active subscription', async () => {
      const createDto: CreateSubscriptionDto = {
        offerId: 'offer-123',
        email: 'test@example.com',
        address: '123 Main St',
        phoneNumber: '1234567890',
        cardNumber: '4111111111111234',
      };

      jest.spyOn(prismaService.offer, 'findUnique').mockResolvedValue(mockOffer);
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(mockSubscription);

      await expect(service.subscribe('user-123', createDto)).rejects.toThrow(
        new BadRequestException('User already has an active subscription. Change subscription instead.')
      );
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel active subscription successfully', async () => {
      jest.spyOn(prismaService.subscription, 'deleteMany').mockResolvedValue({ count: 0 });
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(mockSubscription);
      jest
        .spyOn(prismaService.subscription, 'update')
        .mockResolvedValue({
          ...mockSubscription,
          status: SubscriptionStatus.CANCELLED,
          endedAt: new Date(),
          gracePeriodEndAt: null,
        });

      const result = await service.cancelSubscription('user-123');

      expect(result.status).toBe(SubscriptionStatus.CANCELLED);
      expect(result.endedAt).toBeDefined();
    });

    it('should throw BadRequestException if no active subscription', async () => {
      jest.spyOn(prismaService.subscription, 'deleteMany').mockResolvedValue({ count: 0 });
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(null);

      await expect(service.cancelSubscription('user-123')).rejects.toThrow(
        new BadRequestException('No active subscription to cancel')
      );
    });
  });

  describe('requestCancellation', () => {
    it('should request cancellation with grace period', async () => {
      jest.spyOn(prismaService.subscription, 'deleteMany').mockResolvedValue({ count: 0 });
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(mockSubscription);
      jest
        .spyOn(prismaService.subscription, 'update')
        .mockResolvedValue({
          ...mockSubscription,
          status: SubscriptionStatus.CANCELLATION_PENDING,
          cancellationRequestedAt: new Date(),
          gracePeriodEndAt: new Date(),
        });

      const result = await service.requestCancellation('user-123');

      expect(result.status).toBe(SubscriptionStatus.CANCELLATION_PENDING);
      expect(result.cancellationRequestedAt).toBeDefined();
    });

    it('should throw BadRequestException if no active subscription to cancel', async () => {
      jest.spyOn(prismaService.subscription, 'deleteMany').mockResolvedValue({ count: 0 });
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(null);

      await expect(service.requestCancellation('user-123')).rejects.toThrow(
        new BadRequestException('No active subscription to cancel')
      );
    });
  });

  describe('getUserSubscription', () => {
    it('should get user active subscription', async () => {
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(mockSubscription);

      const result = await service.getUserSubscription('user-123');

      expect(result).toEqual(mockSubscription);
      expect(result!.status).toBe(SubscriptionStatus.ACTIVE);
      expect(prismaService.subscription.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: 'user-123',
            status: SubscriptionStatus.ACTIVE,
          },
          include: { offer: true },
        })
      );
    });

    it('should return null if no active subscription', async () => {
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(null);

      const result = await service.getUserSubscription('user-123');

      expect(result).toBeNull();
    });
  });

  describe('changeSubscription', () => {
    it('should change to new offer successfully', async () => {
      const newOffer = { ...mockOffer, id: 'offer-456', price: 149 };
      const newSubscription = { ...mockSubscription, offerId: 'offer-456', soldPrice: 149 };
      const cancelledSubscription = { ...mockSubscription, status: SubscriptionStatus.CANCELLED, gracePeriodEndAt: null };

      jest.spyOn(prismaService.subscription, 'findFirst')
        .mockResolvedValueOnce(mockSubscription) // getUserSubscription
        .mockResolvedValueOnce(mockSubscription) // cancelSubscription -> findFirst
        .mockResolvedValueOnce(null); // After changeSubscription create

      jest.spyOn(prismaService.offer, 'findUnique').mockResolvedValue(newOffer);
      jest.spyOn(prismaService.payment, 'findFirst').mockResolvedValue(mockPayment);
      jest.spyOn(prismaService.subscription, 'deleteMany').mockResolvedValue({ count: 0 });
      jest
        .spyOn(prismaService.subscription, 'update')
        .mockResolvedValue(cancelledSubscription);
      jest.spyOn(prismaService.subscription, 'create').mockResolvedValue(newSubscription);
      jest.spyOn(prismaService.payment, 'create').mockResolvedValue(mockPayment);

      const result = await service.changeSubscription('user-123', 'offer-456');

      expect(result.offerId).toBe('offer-456');
      expect(result.soldPrice).toBe(149);
    });

    it('should throw BadRequestException if no active subscription to change', async () => {
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(null);

      await expect(service.changeSubscription('user-123', 'offer-456')).rejects.toThrow(
        new BadRequestException('No active subscription to change')
      );
    });

    it('should throw BadRequestException if new offer not found', async () => {
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(mockSubscription);
      jest.spyOn(prismaService.offer, 'findUnique').mockResolvedValue(null);

      await expect(service.changeSubscription('user-123', 'invalid-offer')).rejects.toThrow(
        new BadRequestException('New offer not found')
      );
    });
  });

  describe('suggestOffer', () => {
    it('should suggest offers with higher price', async () => {
      const suggestedOffers = [
        { ...mockOffer, id: 'offer-456', price: 149 },
        { ...mockOffer, id: 'offer-789', price: 199 },
      ];

      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(mockSubscription);
      jest.spyOn(prismaService.offer, 'findMany').mockResolvedValue(suggestedOffers);

      const result = await service.suggestOffer('user-123');

      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(149);
      expect(result[1].price).toBe(199);
    });

    it('should return empty array if no active subscription', async () => {
      jest.spyOn(prismaService.subscription, 'findFirst').mockResolvedValue(null);

      const result = await service.suggestOffer('user-123');

      expect(result).toEqual([]);
    });
  });
});
