import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Offer  } from '@prisma/client';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Offer[]> {
    return this.prisma.offer.findMany({
      orderBy: {
        price: 'asc',
      },
    });
  }

  async findById(id: string): Promise<Offer | null> {
    return this.prisma.offer.findUnique({
      where: { id },
    }) as Promise<Offer | null>;
  }
}
