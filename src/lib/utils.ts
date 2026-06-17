import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(
  value?: string | number | Date | null,
  labels: { missingLabel?: string; invalidLabel?: string } = {},
) {
  const { missingLabel = "Date indisponible", invalidLabel = "Date invalide" } = labels;

  if (value === undefined || value === null || value === "") return missingLabel;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return invalidLabel;

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(date);
}
