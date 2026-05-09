import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { Offer } from '@prisma/client';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';

@ApiTags('offers')
@ApiBearerAuth()
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all available offers' })
  @ApiResponse({ status: 200, description: 'List of all offers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get offer by ID' })
  @ApiResponse({ status: 200, description: 'Offer details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Offer not found' })
  async findById(@Param('id') id: string): Promise<Offer | null> {
    return this.offersService.findById(id);
  }
}
