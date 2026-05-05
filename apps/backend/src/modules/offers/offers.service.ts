import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  minutes: string;
  texts: string;
  data: string;
  isForFirstSubscription: boolean;
  isForSwitch: boolean;
  isForReSubscription: boolean;
  advantages: any;
  createdAt: Date;
}

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Offer[]> {
    console.log('Fetching all offers from the database', await this.prisma.offer.findMany({
      orderBy: {
        price: 'asc',
      },
    }));
    return this.prisma.offer.findMany({
      orderBy: {
        price: 'asc',
      },
    })
  }

  async findById(id: string): Promise<Offer | null> {
    return this.prisma.offer.findUnique({
      where: { id },
    }) as Promise<Offer | null>;
  }
}
