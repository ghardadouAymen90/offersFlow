import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  fullName: string;

  @ApiProperty({
    example: 'MALE',
    description: 'User gender',
  })
  gender: string;

  @ApiProperty({
    example: 25,
    description: 'User age',
  })
  age: number;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'User creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'User last update timestamp',
  })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    type: UserResponseDto,
    description: 'User information without password',
  })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT authentication token',
  })
  token: string;
}
