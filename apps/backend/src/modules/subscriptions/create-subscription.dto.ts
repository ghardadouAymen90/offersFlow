import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The ID of the offer to subscribe to',
    example: 'offer-id-123',
  })
  @IsNotEmpty({ message: 'offerId is required' })
  @IsString({ message: 'offerId must be a string' })
  offerId: string;

  @ApiProperty({
    description: 'Email address for the subscription',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'Physical address for billing',
    example: '123 Main St, City, Country',
  })
  @IsNotEmpty({ message: 'address is required' })
  @IsString({ message: 'address must be a string' })
  address: string;

  @ApiProperty({
    description: 'Phone number for the subscription',
    example: '+33612345678',
  })
  @IsNotEmpty({ message: 'phoneNumber is required' })
  @IsString({ message: 'phoneNumber must be a string' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Credit card number for payment',
    example: '4242424242424242',
  })
  @IsNotEmpty({ message: 'cardNumber is required' })
  //@IsCreditCard({ message: 'cardNumber must be a valid credit card number' })
  @IsString({ message: 'cardNumber must be a string' })
  cardNumber: string;
}
