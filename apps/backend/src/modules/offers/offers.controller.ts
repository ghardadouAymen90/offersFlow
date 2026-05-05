import { Controller, Get, Param } from '@nestjs/common';
import { OffersService, Offer } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Offer | null> {
    return this.offersService.findById(id);
  }
}
