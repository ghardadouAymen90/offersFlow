import { registerSchema } from './register';

describe('Register Schema', () => {
  it('should validate correct registration data', () => {
    const validData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      age: 25,
      gender: 'MALE',
    };

    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should require full name', () => {
    const invalidData = {
      fullName: '',
      email: 'john@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      age: 25,
      gender: 'MALE',
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require minimum name length', () => {
    const invalidData = {
      fullName: 'J',
      email: 'john@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      age: 25,
      gender: 'MALE',
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should validate email format', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'invalid-email',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      age: 25,
      gender: 'MALE',
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require passwords to match', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Test@1234',
      confirmPassword: 'Different@1234',
      age: 25,
      gender: 'MALE',
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require minimum age of 18', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      age: 16,
      gender: 'MALE',
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept valid gender values', () => {
    const validData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      age: 25,
      gender: 'FEMALE',
    };

    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should default gender to MALE', () => {
    const dataWithoutGender = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      age: 25,
    };

    const result = registerSchema.safeParse(dataWithoutGender);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.gender).toBe('MALE');
    }
  });
});
