// ===========================
// Agent API Types
// ===========================

/**
 * Request para criação de agente
 * Baseado no exemplo fornecido do backend
 */
export interface CreateAgentRequest {
    /** Nome do agente */
    name: string
    /** Tipo do agente */
    type: 'SUPPORT' | 'SALES' | 'GENERAL'
    /** Comportamento do agente */
    behaviour: string
    /** Características do agente */
    characteristics: string
    /** ID da voz */
    voice_id: string
}

/**
 * Request para atualização de agente
 * Baseado no exemplo fornecido do backend
 */
export interface UpdateAgentRequest {
    /** Nome do agente */
    name?: string
    /** Tipo do agente */
    type?: 'SUPPORT' | 'SALES' | 'GENERAL'
    /** Comportamento do agente */
    behaviour?: string
    /** Características do agente */
    characteristics?: string
    /** ID da voz */
    voice_id?: string
}

/**
 * Resposta da criação de agente
 * Baseado no exemplo fornecido do backend
 */
export interface CreateAgentResponse {
    /** ID do agente */
    id: string
    /** Nome do agente */
    name: string
    /** Tipo do agente */
    type: 'SUPPORT' | 'SALES' | 'GENERAL'
    /** Comportamento do agente */
    behaviour: string
    /** Características do agente */
    characteristics: string
    /** ID da voz */
    voice_id: string
    /** ID da organização */
    organization_id: string
    /** Data de criação */
    created_at: string
    /** Data de atualização */
    updated_at: string
    /** Data de exclusão (nullable) */
    deleted_at: string | null
}

/**
 * Resposta da atualização de agente
 */
export type UpdateAgentResponse = CreateAgentResponse

/**
 * Resposta da listagem de agentes
 * A API retorna diretamente um array, não um objeto wrapper
 */
export type ListAgentsResponse = CreateAgentResponse[]

/**
 * Resposta de detalhes de um agente
 * A API retorna diretamente o agente
 */
export type GetAgentResponse = CreateAgentResponse

// ===========================
// Voice Types
// ===========================

/**
 * Estrutura de uma voz disponível para agentes
 */
export interface Voice {
    /** ID único da voz */
    id: string
    /** Nome da voz */
    name: string
    /** Gênero da voz (male/female) */
    gender: 'MALE' | 'FEMALE' | 'NON_BINARY'
    /** Características da voz */
    characteristics: {
        [key: string]: string
    }
    /** Descrição da voz */
    description: string
    /** URL de sample/preview da voz (opcional) */
    sample_url?: string | null
    /** Data de criação */
    created_at: string
    /** Data de atualização */
    updated_at: string
}

/**
 * Resposta da API para listagem de vozes
 */
export type ListVoicesResponse = Voice[]
