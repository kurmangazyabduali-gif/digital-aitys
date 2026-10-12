/**
 * Digital Aitys — Client & Server NLP Utility for Kazakh Poetry
 * Порт алгоритма подсчета слогов, рифм и токенизации на TypeScript.
 */

export const KAZAKH_VOWELS = new Set([
  "а", "ә", "о", "ө", "ұ", "ү", "ы", "і", "е", "и", "у", "я", "ю", "э",
  "А", "Ә", "О", "Ө", "Ұ", "Ү", "Ы", "І", "Е", "И", "У", "Я", "Ю", "Э"
]);

/**
 * Подсчет слогов в строке на казахском языке
 */
export function countSyllablesInLine(line: string): number {
  let count = 0;
  for (const char of line) {
    if (KAZAKH_VOWELS.has(char)) {
      count++;
    }
  }
  return count;
}

/**
 * Подсчет слогов для всех строк текста
 */
export function countSyllables(text: string): number[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return lines.map(countSyllablesInLine);
}

/**
 * Анализ стихотворного размера:
 * - Жыр (7-8 буын)
 * - Қара өлең (11 буын)
 */
export function analyzeMeter(lines: string[]) {
  const cleanLines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
  if (cleanLines.length === 0) {
    return { meter: "Белгісіз", avg: 0, counts: [] as number[], isZhyr: false, isQaraOlen: false };
  }

  const counts = cleanLines.map(countSyllablesInLine);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;

  const isZhyr = counts.every((c) => c === 7 || c === 8) || (avg >= 6.8 && avg <= 8.2);
  const isQaraOlen = counts.every((c) => c === 11) || (avg >= 10.5 && avg <= 11.5);

  let meter = `Еркін өлшем (${avg.toFixed(1)} буын)`;
  if (isZhyr) meter = "Жыр өлшемі (7-8 буын)";
  if (isQaraOlen) meter = "Қара өлең өлшемі (11 буын)";

  return {
    meter,
    avg: Number(avg.toFixed(1)),
    counts,
    isZhyr,
    isQaraOlen,
  };
}

/**
 * Определение рифмуемости двух слов
 */
export function areRhyming(w1: string, w2: string): boolean {
  const clean1 = w1.toLowerCase().replace(/[^a-zA-Zа-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺ]/g, "");
  const clean2 = w2.toLowerCase().replace(/[^a-zA-Zа-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺ]/g, "");
  if (!clean1 || !clean2) return false;
  if (clean1 === clean2) return true;

  if (clean1.length >= 3 && clean2.length >= 3 && clean1.slice(-3) === clean2.slice(-3)) {
    return true;
  }
  if (clean1.length >= 2 && clean2.length >= 2 && clean1.slice(-2) === clean2.slice(-2)) {
    return true;
  }
  return false;
}

/**
 * Определение схемы рифмовки (а-а-б-а, а-б-а-б, а-а-б-б)
 */
export function detectRhymeScheme(lines: string[]) {
  const cleanLines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
  if (cleanLines.length < 4) {
    return { scheme: "Қысқа шумақ (<4 жол)", pattern: "short", isQaraOlen: false };
  }

  const lastWords = cleanLines.slice(0, 4).map((line) => {
    const parts = line.split(/\s+/);
    return parts[parts.length - 1] || "";
  });

  const [w1, w2, w3, w4] = lastWords;
  const r12 = areRhyming(w1, w2);
  const r14 = areRhyming(w1, w4);
  const r24 = areRhyming(w2, w4);
  const r13 = areRhyming(w1, w3);
  const r34 = areRhyming(w3, w4);

  // Қара өлең (а-а-б-а)
  if ((r12 && r14) || (r12 && r24) || (r14 && r24)) {
    return { scheme: "Қара өлең ұйқасы (а-а-б-а)", pattern: "a-a-b-a", isQaraOlen: true };
  }
  // Шалыс (а-б-а-б)
  if (r13 && r24) {
    return { scheme: "Шалыс ұйқас (а-б-а-б)", pattern: "a-b-a-b", isQaraOlen: false };
  }
  // Егіз (а-а-б-б)
  if (r12 && r34) {
    return { scheme: "Егіз ұйқас (а-а-б-б)", pattern: "a-a-b-b", isQaraOlen: false };
  }

  return { scheme: "Еркін ұйқас", pattern: "custom", isQaraOlen: false };
}
