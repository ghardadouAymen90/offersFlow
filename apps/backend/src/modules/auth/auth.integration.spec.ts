import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Auth Routes Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    try {
      await prismaService.user.deleteMany({
        where: {
          OR: [
            { email: { contains: 'test-' } },
            { email: { contains: 'duplicate-' } },
            { email: { contains: 'young-' } },
            { email: { contains: 'invalid-' } },
            { email: { contains: 'login-test-' } },
            { email: { contains: 'me-test-' } },
          ],
        },
      });
    } catch (error) {
      console.error('Error cleaning up test users:', error);
    }
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'Test@1234',
          fullName: 'Test User',
          age: 25,
          gender: 'MALE',
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBeDefined();
    });

    it('should reject registration with duplicate email', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'Test@1234',
          fullName: 'Test User',
          age: 25,
          gender: 'MALE',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'Test@1234',
          fullName: 'Test User',
          age: 25,
          gender: 'MALE',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject registration with age < 18', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `young-${Date.now()}@example.com`,
          password: 'Test@1234',
          fullName: 'Young User',
          age: 16,
          gender: 'MALE',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test@1234',
          fullName: 'Test User',
          age: 25,
          gender: 'MALE',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject registration with missing fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          // missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/login', () => {
    let testEmail: string;
    const testPassword = 'Test@1234';

    beforeAll(async () => {
      testEmail = `login-test-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          fullName: 'Login Test User',
          age: 25,
          gender: 'FEMALE',
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testEmail);
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject login with non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: `nonexistent-${Date.now()}@example.com`,
          password: testPassword,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: testPassword,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /auth/me', () => {
    let authToken: string;
    let testEmail: string;

    beforeAll(async () => {
      testEmail = `me-test-${Date.now()}@example.com`;
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'Test@1234',
          fullName: 'Me Test User',
          age: 30,
          gender: 'MALE',
        });
      authToken = registerResponse.body.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testEmail);
    });

    it('should reject request without token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('should reject request with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid_token_xyz')
        .expect(401);
    });

    it('should reject request with malformed auth header', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'InvalidHeader')
        .expect(401);
    });
  });
});
