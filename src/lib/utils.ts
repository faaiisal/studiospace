import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STUDIO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";

export function getStudioImage(src?: string | null) {
  if (!src || src.trim() === "" || src === "undefined") return STUDIO_FALLBACK_IMAGE;
  return src;
}

export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = STUDIO_FALLBACK_IMAGE
) {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}

