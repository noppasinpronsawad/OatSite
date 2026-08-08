/**
 * ETS Standard TOEIC Reading Conversion Table (Raw Score 0-100 -> Exact Scaled Score 5-495 in increments of 5)
 */
const RAW_TO_SCALED_MAP = {
  100: 495, 99: 495, 98: 490, 97: 485, 96: 475, 95: 470, 94: 460, 93: 455, 92: 450, 91: 440,
  90: 435, 89: 430, 88: 425, 87: 420, 86: 415, 85: 410, 84: 405, 83: 400, 82: 395, 81: 390,
  80: 385, 79: 380, 78: 375, 77: 370, 76: 365, 75: 360, 74: 355, 73: 350, 72: 345, 71: 340,
  70: 335, 69: 330, 68: 325, 67: 320, 66: 315, 65: 310, 64: 300, 63: 295, 62: 290, 61: 280,
  60: 275, 59: 270, 58: 265, 57: 260, 56: 255, 55: 250, 54: 245, 53: 240, 52: 235, 51: 230,
  50: 225, 49: 220, 48: 215, 47: 210, 46: 200, 45: 195, 44: 190, 43: 185, 42: 180, 41: 170,
  40: 165, 39: 160, 38: 155, 37: 150, 36: 145, 35: 140, 34: 135, 33: 130, 32: 125, 31: 120,
  30: 115, 29: 110, 28: 105, 27: 100, 26: 95, 25: 90, 24: 85, 23: 80, 22: 75, 21: 70,
  20: 60, 19: 55, 18: 50, 17: 45, 16: 40, 15: 35, 14: 30, 13: 25, 12: 20, 11: 15,
  10: 10, 9: 5, 8: 5, 7: 5, 6: 5, 5: 5, 4: 5, 3: 5, 2: 5, 1: 5, 0: 5
};

function calculateToeicReadingScore(rawScore, totalQuestions = 100) {
  // Normalize raw score to scale of 100 if exam was shorter (e.g. 20 Qs)
  const normalizedRaw = Math.min(100, Math.max(0, Math.round((rawScore / totalQuestions) * 100)));
  const scaledScore = RAW_TO_SCALED_MAP[normalizedRaw] || 5;

  let cefrLevel = 'A1';
  let cefrBadge = 'A1 Beginner';
  let cefrColor = '#ff9500';

  if (scaledScore >= 470) {
    cefrLevel = 'C1';
    cefrBadge = 'C1 Advanced';
    cefrColor = '#af52de';
  } else if (scaledScore >= 385) {
    cefrLevel = 'B2';
    cefrBadge = 'B2 Upper-Intermediate';
    cefrColor = '#2997ff';
  } else if (scaledScore >= 275) {
    cefrLevel = 'B1';
    cefrBadge = 'B1 Intermediate';
    cefrColor = '#30d158';
  } else if (scaledScore >= 115) {
    cefrLevel = 'A2';
    cefrBadge = 'A2 Elementary';
    cefrColor = '#ffd60a';
  }

  return {
    rawScore,
    totalQuestions,
    normalizedRaw,
    scaledScore,
    cefrLevel,
    cefrBadge,
    cefrColor
  };
}

module.exports = { calculateToeicReadingScore, RAW_TO_SCALED_MAP };
