export const APP_CONFIG = {
    name: 'Gerson',
    version: '1.0.0',
    description: 'Sistema de Call Center Automatizado',
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100',
        timeout: 10000, // 10 segundos
    },
} as const;
