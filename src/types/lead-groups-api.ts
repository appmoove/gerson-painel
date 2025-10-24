// ===========================
// Lead Groups API Types
// ===========================

/**
 * Dados para criação de um grupo de leads
 */
export interface CreateLeadGroupRequest {
    /** Nome do grupo de leads */
    name: string
}

/**
 * Dados para atualização de um grupo de leads
 */
export interface UpdateLeadGroupRequest {
    /** Nome do grupo de leads */
    name?: string
}

/**
 * Resposta da criação de um grupo de leads
 */
export interface CreateLeadGroupResponse {
    /** ID único do grupo */
    id: string
    /** ID da organização */
    organization_id: string
    /** Nome do grupo */
    name: string
    /** Quantidade de leads no grupo */
    leads_count: number
    /** Data de criação */
    created_at: string
    /** Data de atualização */
    updated_at: string
}

/**
 * Informações básicas de um lead
 */
export interface LeadInfo {
    /** ID único do lead */
    id: string
    /** Nome do lead */
    name: string | null
    /** Email do lead */
    email: string | null
    /** Telefone do lead */
    phone: string | null
    /** Data de criação */
    created_at: string
    /** Data de atualização */
    updated_at: string
}

/**
 * Resposta da criação de um grupo de leads
 */
export interface CreateLeadGroupResponse {
    /** ID único do grupo */
    id: string
    /** ID da organização */
    organization_id: string
    /** Nome do grupo */
    name: string
    /** Quantidade de leads no grupo */
    leads_count: number
    /** Data de criação */
    created_at: string
    /** Data de atualização */
    updated_at: string
}

/**
 * Resposta da busca de um grupo específico (inclui leads)
 */
export interface GetLeadGroupResponse {
    /** ID único do grupo */
    id: string
    /** ID da organização */
    organization_id: string
    /** Nome do grupo */
    name: string
    /** Leads neste grupo */
    leads: LeadInfo[]
    /** Data de criação */
    created_at: string
    /** Data de atualização */
    updated_at: string
}