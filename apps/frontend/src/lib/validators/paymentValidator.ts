export const validateCardNumber = (card: string): boolean => {
  const cleanCard = card.replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleanCard);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  return /^\d{10,15}$/.test(cleanPhone);
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5;
};
