import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getCardClassName(
  isSelectedAnswer: boolean | undefined,
  isUserCorrect: boolean,
  isCorrect: boolean
) {
  if (!isSelectedAnswer) {
    return;
  }

  if (isUserCorrect && isCorrect) {
    return 'border-emerald-600 bg-emerald-100/50 border-2';
  }

  if (!isUserCorrect && !isCorrect) {
    return 'border-rose-600 bg-rose-100/50 border-2';
  }

  if (isUserCorrect && !isCorrect) {
    return 'border-rose-600 bg-rose-100/50 border-2';
  }

  if (!isUserCorrect && isCorrect) {
    return 'border-emerald-600 bg-emerald-100/50 border-2';
  }
}

export function getTextClassName(
  isSelectedAnswer: boolean | undefined,
  isUserCorrect: boolean,
  isCorrect: boolean
) {
  if (isUserCorrect && isCorrect) {
    return 'text-emerald-600 dark:text-emerald-500 text-sm font-medium';
  }

  if (isCorrect && !isSelectedAnswer && !isUserCorrect) {
    return 'text-emerald-600 dark:text-emerald-500 text-lg font-semibold';
  }

  if (isCorrect) {
    return 'text-emerald-600 dark:text-emerald-500 text-sm font-medium';
  }

  if (!isUserCorrect && !isCorrect) {
    return 'text-rose-600 dark:text-rose-500 text-sm font-medium';
  }

  if (isUserCorrect && !isCorrect) {
    return 'text-rose-600 dark:text-rose-500 text-sm font-medium';
  }

  if (!isUserCorrect && isCorrect) {
    return 'text-emerald-600 dark:text-emerald-500 text-sm font-medium';
  }
}

export function getTextContent(
  isSelectedAnswer: boolean | undefined,
  isUserCorrect: boolean,
  isCorrect: boolean
) {
  if (isCorrect && !isSelectedAnswer && !isUserCorrect) {
    return 'Das wäre die richtige Antwort gewesen.';
  }

  if (isUserCorrect && isCorrect) {
    return 'Richtige Antwort';
  }

  if (isCorrect) {
    return 'Richtige Antwort';
  }

  if (isSelectedAnswer && !isUserCorrect && !isCorrect) {
    return 'Leider die falsche Antwort';
  }
}
