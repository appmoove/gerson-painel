/**
 * Constantes e configurações relacionadas aos agentes
 */

// ===========================
// Validation Constants
// ===========================

/**
 * Constantes e configurações relacionadas aos agentes
 */

// ===========================
// Validation Constants
// ===========================

export const AGENT_VALIDATION = {
    // Nome
    NAME: {
        REQUIRED: "Nome é obrigatório",
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        MIN_LENGTH_MESSAGE: "Nome deve ter pelo menos 2 caracteres",
        MAX_LENGTH_MESSAGE: "Nome deve ter no máximo 100 caracteres"
    },

    // Tipo
    TYPE: {
        REQUIRED: "Tipo é obrigatório"
    },

    // Comportamento
    BEHAVIOUR: {
        REQUIRED: "Comportamento é obrigatório",
        MIN_LENGTH: 10,
        MAX_LENGTH: 2000,
        MIN_LENGTH_MESSAGE: "Comportamento deve ter pelo menos 10 caracteres",
        MAX_LENGTH_MESSAGE: "Comportamento deve ter no máximo 2000 caracteres"
    },

    // Características
    CHARACTERISTICS: {
        REQUIRED: "Características são obrigatórias",
        MIN_LENGTH: 10,
        MAX_LENGTH: 2000,
        MIN_LENGTH_MESSAGE: "Características devem ter pelo menos 10 caracteres",
        MAX_LENGTH_MESSAGE: "Características devem ter no máximo 2000 caracteres"
    },

    // Tipo de Voz
    VOICE_ID: {
        REQUIRED: "Voz é obrigatória",
        INVALID: "Voz selecionada é inválida"
    }
} as const

// ===========================
// Voice Labels (Future Implementation)
// ===========================

/**
 * Placeholder para future voice labels
 * Será implementado quando a rota de voices estiver disponível
 */

// ===========================
// Form Defaults
// ===========================

export const AGENT_FORM_DEFAULTS = {
    type: 'SUPPORT' as const,
    voice_id: "" // Será preenchido quando houver voices disponíveis
} as const

// ===========================
// Agent Type Labels
// ===========================

export const AGENT_TYPE_LABELS = {
    SUPPORT: "Suporte",
    SALES: "Vendas", 
    GENERAL: "Geral"
} as const
