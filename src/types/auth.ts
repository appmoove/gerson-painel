// ===========================
// API Request/Response Types
// ===========================

/**
 * Dados necessários para fazer login na API
 * Corresponde ao LoginDto do backend
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Dados do usuário retornados pela API de login
 */
export interface LoginUserData {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    },
    organization: {
        id: string;
        name: string;
    },
    permissions: string[];
    lastLogin: string | null;
}

/**
 * Resposta de sucesso da API de login
 */
export interface LoginResponse {
    token: string;
    payload: LoginUserData;
}


// ===========================
// JWT & Authentication Types
// ===========================

/**
 * Dados do usuário autenticado (dados da API + token)
 */
export interface AuthenticatedUser {
    /** ID do usuário */
    id: string;
    /** Nome do usuário */
    name: string;
    /** Email do usuário */
    email: string;
    /** Role do usuário */
    role: string;
    /** ID da empresa */
    companyId: string;
    /** Token JWT */
    token: string;
    /** Avatar do usuário (opcional) */
    avatar?: string | null;
    /** Timestamp do último login */
    lastLogin: string | null;
}

// ===========================
// Storage Types
// ===========================

/**
 * Dados salvos no localStorage
 */
export interface StoredAuthData {
    token: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any; // Pode ser User do store ou AuthenticatedUser
    expiresAt?: number;
}

/**
 * Chaves do localStorage para auth
 */
export type AuthStorageKeys = {
    TOKEN: 'gerson_auth_token';
    USER: 'gerson_auth_user';
    REMEMBER_ME: 'gerson_remember_me';
    EXPIRES_AT: 'gerson_auth_expires';
}
