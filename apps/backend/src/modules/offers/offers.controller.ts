import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<Offer | null> {
    return this.offersService.findById(id);
  }
}
