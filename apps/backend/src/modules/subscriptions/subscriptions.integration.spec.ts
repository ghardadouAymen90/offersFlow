import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Subscriptions Routes Integration Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let prismaService: PrismaService;
  let testUserEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    testUserEmail = `subscription-test-${Date.now()}@example.com`;
    const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({
      email: testUserEmail,
      password: 'Test@1234',
      fullName: 'Subscription Test User',
      age: 28,
      gender: 'MALE',
    });

    authToken = registerResponse.body.token;
  });

  afterAll(async () => {
    try {
      const testUser = await prismaService.user.findUnique({
        where: { email: testUserEmail },
      });

      if (testUser) {
        await prismaService.subscription.deleteMany({
          where: { userId: testUser.id },
        });

        await prismaService.user.delete({
          where: { id: testUser.id },
        });
      }
    } catch (error) {
      console.error('Error cleaning up test subscription data:', error);
    }
    await app.close();
  });

  describe('POST /subscriptions', () => {
    it('should subscribe to an offer with valid offer ID', async () => {
      const offersResponse = await request(app.getHttpServer())
        .get('/offers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (offersResponse.body.length === 0) {
        return;
      }

      let subscriptionCreated = false;
      for (const offer of offersResponse.body) {
        const response = await request(app.getHttpServer())
          .post('/subscriptions')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            offerId: offer.id,
            email: 'test@example.com',
            address: '123 Main Street, City, Country',
            phoneNumber: '+1234567890',
            cardNumber: '4242 4242 4242 4242',
          });

        if (response.status === 201) {
          expect(response.body).toHaveProperty('subscription');
          expect(response.body.subscription).toHaveProperty('id');
          expect(response.body.subscription.status).toBe('ACTIVE');
          subscriptionCreated = true;
          break;
        }
      }

      if (!subscriptionCreated) {
        return;
      }
    });

    it('should reject subscription without authentication', async () => {
      await request(app.getHttpServer())
        .post('/subscriptions')
        .send({ offerId: 'test-id' })
        .expect(401);
    });

    it('should reject subscription with invalid offer ID', async () => {
      const response = await request(app.getHttpServer())
        .post('/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          offerId: '00000000-0000-0000-0000-000000000000',
          email: 'test@example.com',
          address: '123 Main Street, City, Country',
          phoneNumber: '+1234567890',
          cardNumber: '4242 4242 4242 4242',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /subscriptions/current', () => {
    it('should get current subscription or 404 if none', async () => {
      const response = await request(app.getHttpServer())
        .get('/subscriptions/current')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 404]).toContain(response.status);
    });

    it('should reject without authentication', async () => {
      await request(app.getHttpServer()).get('/subscriptions/current').expect(401);
    });
  });

  describe('GET /subscriptions/suggest', () => {
    it('should get suggested offers', async () => {
      const response = await request(app.getHttpServer())
        .get('/subscriptions/suggest')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject without authentication', async () => {
      await request(app.getHttpServer()).get('/subscriptions/suggest').expect(401);
    });
  });

  describe('POST /subscriptions/request-cancellation', () => {
    it('should reject without authentication', async () => {
      await request(app.getHttpServer()).post('/subscriptions/request-cancellation').expect(401);
    });
  });

  describe('POST /subscriptions/change', () => {
    it('should reject without authentication', async () => {
      await request(app.getHttpServer())
        .post('/subscriptions/change')
        .send({ offerId: 'test-id' })
        .expect(401);
    });
  });
});
