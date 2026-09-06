import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined, currency = "USD") {
  if (price === null || price === undefined) return "Trade Only";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function getConditionBadgeColor(condition: string) {
  switch (condition) {
    case "BRAND_NEW":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:text-emerald-300";
    case "LIKE_NEW":
      return "bg-teal-500/15 text-teal-700 border-teal-300 dark:text-teal-300";
    case "VERY_GOOD":
      return "bg-blue-500/15 text-blue-700 border-blue-300 dark:text-blue-300";
    case "GOOD":
      return "bg-amber-500/15 text-amber-700 border-amber-300 dark:text-amber-300";
    case "ACCEPTABLE":
      return "bg-orange-500/15 text-orange-700 border-orange-300 dark:text-orange-300";
    default:
      return "bg-gray-500/15 text-gray-700 border-gray-300 dark:text-gray-300";
  }
}

export function getExchangeTypeBadge(type: string) {
  switch (type) {
    case "BARTER_ONLY":
      return {
        label: "Barter Only",
        classes: "bg-gold/15 text-ink border-gold/40",
      };
    case "CASH_ONLY":
      return {
        label: "Cash Only",
        classes: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300",
      };
    case "HYBRID":
    default:
      return {
        label: "Cash or Barter",
        classes: "bg-sage-tint text-sage border-sage/20",
      };
  }
}
