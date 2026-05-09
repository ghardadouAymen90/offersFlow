import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'User password (minimum 6 characters)',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  fullName: string;

  @ApiProperty({
    example: 'MALE',
    enum: ['MALE', 'FEMALE', 'OTHER'],
    description: 'User gender',
  })
  gender: string;

  @ApiProperty({
    example: 25,
    description: 'User age',
    minimum: 18,
  })
  age: number;
}
