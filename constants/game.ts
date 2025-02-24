export const TOTAL_QUESTIONS = 15;
export const VICTORY_PERCENTAGE = 0.9;
export const REQUIRED_SCORE = Math.max(1, Math.ceil(TOTAL_QUESTIONS * VICTORY_PERCENTAGE));
export const DEFAULT_HINTS = Math.min(3, REQUIRED_SCORE);
