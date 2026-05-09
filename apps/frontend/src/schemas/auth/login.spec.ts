import { loginSchema, type LoginFormData } from './login';

describe('Login Schema', () => {
  it('should validate correct login data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Test@1234',
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should require email', () => {
    const invalidData = {
      email: '',
      password: 'Test@1234',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should validate email format', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'Test@1234',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require password minimum length', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '123',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should require password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
