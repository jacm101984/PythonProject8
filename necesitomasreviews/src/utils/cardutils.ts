// src/utils/cardUtils.ts
import crypto from 'crypto';

// Generate unique card IDs
export const generateCardIds = (count: number): string[] => {
  const cardIds: string[] = [];

  for (let i = 0; i < count; i++) {
    // Generate a unique ID (combination of timestamp and random string)
    const randomBytes = crypto.randomBytes(4).toString('hex');
    const timestamp = Date.now().toString(36);
    const cardId = `NFC${timestamp}${randomBytes}`.toUpperCase();

    cardIds.push(cardId);
  }

  return cardIds;
};

// Validate card ID format
export const validateCardId = (cardId: string): boolean => {
  // Card ID should start with 'NFC' followed by alphanumeric characters
  const cardIdRegex = /^NFC[A-Z0-9]{8,}$/;
  return cardIdRegex.test(cardId);
};