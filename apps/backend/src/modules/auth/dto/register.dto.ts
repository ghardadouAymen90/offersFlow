import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
    required: true
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'SecurePassword123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
    required: true
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: true
  })
  fullName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'MALE',
    enum: ['MALE', 'FEMALE', 'OTHER'],
    description: 'User gender',
    required: true
  })
  gender: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 25,
    description: 'User age',
    minimum: 18,
    required: true
  })
  age: number;
}
