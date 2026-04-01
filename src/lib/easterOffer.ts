// Easter Holiday Offer Configuration
// Offer runs for 4 days and auto-expires
const OFFER_END = new Date("2026-04-21T23:59:59").getTime();

export const EASTER_OFFER = {
  enabled: true,
  originalPrice: 2500,
  offerPrice: 999,
  offerUsd: 7.75,
  endDate: OFFER_END,
};

export function isEasterOfferActive(): boolean {
  if (!EASTER_OFFER.enabled) return false;
  return Date.now() < EASTER_OFFER.endDate;
}

export function getTimeLeft() {
  const diff = Math.max(0, EASTER_OFFER.endDate - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
    expired: diff === 0,
  };
}

export function getCurrentPricing() {
  if (isEasterOfferActive()) {
    return { kes: EASTER_OFFER.offerPrice, usd: EASTER_OFFER.offerUsd };
  }
  return { kes: EASTER_OFFER.originalPrice, usd: 19.38 };
}
