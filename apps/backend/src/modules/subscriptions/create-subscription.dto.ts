import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty({ message: 'offerId is required' })
  @IsString({ message: 'offerId must be a string' })
  offerId: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'address is required' })
  @IsString({ message: 'address must be a string' })
  address: string;

  @IsNotEmpty({ message: 'phoneNumber is required' })
  @IsString({ message: 'phoneNumber must be a string' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'cardNumber is required' })
  //@IsCreditCard({ message: 'cardNumber must be a valid credit card number' })
  @IsString({ message: 'cardNumber must be a string' })
  cardNumber: string;
}
