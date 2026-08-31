import { Platform } from "@prisma/client";

const PLATFORM_LABELS: Record<Platform, string> = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  BOTH: "Online & Offline",
};

export function formatPlatform(platform: Platform | null): string | null {
  return platform ? PLATFORM_LABELS[platform] : null;
}
