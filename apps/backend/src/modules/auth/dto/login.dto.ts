import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'SecurePassword123',
    description: 'User password',
    required: true,
  })
  password: string;
}
