import { APP_CONFIG } from "../config";
const P = APP_CONFIG.storagePrefix;

export const STORAGE_KEYS = {
  theme: `${P}:theme`,
  locale: `${P}:locale`,
  dateFormat: `${P}:dateFormat`,
} as const;
