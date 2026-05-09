import { validateCardNumber, validatePhoneNumber, validateAddress } from './paymentValidator';

describe('Payment Validators', () => {
  describe('validateCardNumber', () => {
    it('should validate Visa card', () => {
      expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
    });

    it('should validate Mastercard', () => {
      expect(validateCardNumber('5555 5555 5555 4444')).toBe(true);
    });

    it('should validate American Express', () => {
      expect(validateCardNumber('3782 822463 10005')).toBe(true);
    });

    it('should validate Discover card', () => {
      expect(validateCardNumber('6011 1111 1111 1117')).toBe(true);
    });

    it('should reject invalid card format', () => {
      expect(validateCardNumber('1111 1111 1111 1111')).toBe(false);
    });

    it('should accept cards without spaces', () => {
      expect(validateCardNumber('4242424242424242')).toBe(true);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate standard phone number', () => {
      expect(validatePhoneNumber('+1234567890')).toBe(true);
    });

    it('should validate phone with dashes', () => {
      expect(validatePhoneNumber('123-456-7890')).toBe(true);
    });

    it('should validate phone with parentheses', () => {
      expect(validatePhoneNumber('(123) 456-7890')).toBe(true);
    });

    it('should validate 15 digit phone', () => {
      expect(validatePhoneNumber('+1 123 456 7890 123')).toBe(true);
    });

    it('should reject too short phone', () => {
      expect(validatePhoneNumber('123')).toBe(false);
    });

    it('should reject phone with letters', () => {
      expect(validatePhoneNumber('123-ABC-7890')).toBe(false);
    });
  });

  describe('validateAddress', () => {
    it('should validate valid address', () => {
      expect(validateAddress('123 Main Street, New York, NY 10001')).toBe(true);
    });

    it('should validate short valid address', () => {
      expect(validateAddress('123 St')).toBe(true);
    });

    it('should reject address below minimum length', () => {
      expect(validateAddress('123')).toBe(false);
    });

    it('should reject empty address', () => {
      expect(validateAddress('')).toBe(false);
    });

    it('should reject whitespace only', () => {
      expect(validateAddress('   ')).toBe(false);
    });
  });
});
