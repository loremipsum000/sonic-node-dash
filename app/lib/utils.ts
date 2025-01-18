import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function weiToToken(wei: bigint): number {
  return Number(wei) / 1e18;
}

export function formatBigInt(num: bigint): string {
  const units = ['', 'K', 'M', 'B', 'T'];
  let value = num;
  let unitIndex = 0;

  while (value >= 1000n && unitIndex < units.length - 1) {
    value /= 1000n;
    unitIndex++;
  }

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + units[unitIndex];
} 