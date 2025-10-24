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
 * Resposta da atualização de um grupo de leads
 */
export type UpdateLeadGroupResponse = CreateLeadGroupResponse

/**
 * Resposta da listagem de grupos de leads
 */
export type ListLeadGroupsResponse = CreateLeadGroupResponse[]

/**
 * Resposta da busca de um grupo específico
 */
export type GetLeadGroupResponse = CreateLeadGroupResponse