import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  gender: string;
  age: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterRequest): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequest): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Throttle({ long: { limit: 100, ttl: 900000 } })
  async getMe(@Request() req: any): Promise<Omit<User, 'password'>> {
    const { password, ...userWithoutPassword } = req.user;
    return userWithoutPassword;
  }
}
