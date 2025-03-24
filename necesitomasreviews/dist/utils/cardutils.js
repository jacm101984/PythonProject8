"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCardId = exports.generateCardIds = void 0;
// src/utils/cardUtils.ts
const crypto_1 = __importDefault(require("crypto"));
// Generate unique card IDs
const generateCardIds = (count) => {
    const cardIds = [];
    for (let i = 0; i < count; i++) {
        // Generate a unique ID (combination of timestamp and random string)
        const randomBytes = crypto_1.default.randomBytes(4).toString('hex');
        const timestamp = Date.now().toString(36);
        const cardId = `NFC${timestamp}${randomBytes}`.toUpperCase();
        cardIds.push(cardId);
    }
    return cardIds;
};
exports.generateCardIds = generateCardIds;
// Validate card ID format
const validateCardId = (cardId) => {
    // Card ID should start with 'NFC' followed by alphanumeric characters
    const cardIdRegex = /^NFC[A-Z0-9]{8,}$/;
    return cardIdRegex.test(cardId);
};
exports.validateCardId = validateCardId;
//# sourceMappingURL=cardutils.js.map