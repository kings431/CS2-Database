import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatFloat(float: number): string {
  return float.toFixed(4)
}

export function getRarityColor(rarity: string): string {
  const rarityColors: Record<string, string> = {
    'Consumer Grade': 'text-gray-400',
    'Industrial Grade': 'text-blue-400',
    'Mil-Spec Grade': 'text-purple-400',
    'Restricted': 'text-pink-400',
    'Classified': 'text-red-400',
    'Covert': 'text-yellow-400',
    'Extraordinary': 'text-orange-400',
  }
  return rarityColors[rarity] || 'text-gray-400'
}

export function getConditionFromFloat(float: number): string {
  if (float >= 0.45) return 'Battle-Scarred'
  if (float >= 0.38) return 'Well-Worn'
  if (float >= 0.15) return 'Field-Tested'
  if (float >= 0.07) return 'Minimal Wear'
  return 'Factory New'
}