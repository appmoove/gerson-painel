export const APP_CONFIG = {
    name: 'Gerson',
    version: '1.0.0',
    description: 'Sistema de Call Center Automatizado',
    api: {
        baseUrl: import.meta.env.VITE_ORGANIZATION_API_URL || 'https://gerson-organization-api.hackaton.appmoove.com.br',
    },
} as const;
