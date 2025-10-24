export const APP_CONFIG = {
    // Ao alterar, lembrar de alterar também no arquivo ./index.html
    name: 'Gerson',
    version: '1.0.0',
    description: 'Sistema de Call Center Automatizado',
    minor_description: 'Call Center IA',
    api: {
        baseUrl: import.meta.env.VITE_ORGANIZATION_API_URL || 'https://gerson-organization-api.hackaton.appmoove.com.br',
    },
} as const;
