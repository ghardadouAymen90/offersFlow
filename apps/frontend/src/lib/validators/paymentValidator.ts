const bankCardRegex =
  /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

export const validateCardNumber = (card: string): boolean => {
  const cleanCard = card.replace(/\s/g, '');
  return bankCardRegex.test(cleanCard);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-()]+/g, '').replace(/^\+/, '');
  return /^\d{10,15}$/.test(cleanPhone);
};

// cards to use for test:
// Visa:
// 4242 4242 4242 4242
// Mastercard:
// 5555 5555 5555 4444
// American Express:
// 3782 822463 10005
// Discover:
// 6011 1111 1111 1117

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5;
};

// Luhn algo
// to add to payment card validation
const isValidCardNumber = (number: string): boolean => {
  const sanitized = number.replace(/\D/g, '');
  if (!bankCardRegex.test(sanitized)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};
