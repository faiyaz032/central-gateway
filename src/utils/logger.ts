export const logger = {
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${message}`, meta || '');
  },
  info: (message: string, meta?: any) => {
    console.info(`[INFO] ${message}`, meta || '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
};
