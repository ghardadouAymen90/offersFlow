import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeSubscriptionDto {
  @ApiProperty({
    description: 'The ID of the new offer to switch to',
    example: 'offer-id-456',
  })
  @IsNotEmpty({ message: 'offerId is required' })
  @IsString({ message: 'offerId must be a string' })
  offerId: string;
}
