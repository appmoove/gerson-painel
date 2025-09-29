/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** URL da Organization API */
    readonly VITE_ORGANIZATION_API_URL: string
    /** Porta do servidor */
    readonly VITE_PORT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
