// ===========================
// Lead Groups API Types
// ===========================

/**
 * Dados básicos de um grupo de leads
 */
export interface LeadGroupResponse {
  /** ID do grupo */
  id: string;
  /** ID da organização */
  organization_id: string;
  /** Nome do grupo */
  name: string;
  /** Quantidade de leads no grupo */
  leads_count: number;
  /** Data de criação */
  created_at: string;
  /** Data de atualização */
  updated_at: string;
}

/**
 * Dados para criação de um grupo de leads
 */
export interface CreateLeadGroupRequest {
  /** Nome do grupo */
  name: string;
}

/**
 * Resposta da criação de um grupo de leads
 */
export type CreateLeadGroupResponse = LeadGroupResponse

/**
 * Dados para atualização de um grupo de leads
 */
export interface UpdateLeadGroupRequest {
  /** Nome do grupo */
  name: string;
}

/**
 * Resposta da atualização de um grupo de leads
 */
export type UpdateLeadGroupResponse = LeadGroupResponse

/**
 * Filtros para listagem de grupos de leads
 */
export interface LeadGroupFilters {
  /** Filtrar por nome */
  name?: string;
}

/**
 * Parâmetros para listagem de grupos de leads
 */
export interface LeadGroupListParams {
  /** Filtros de busca */
  filters?: LeadGroupFilters;
}

/**
 * Resposta da listagem de grupos de leads
 */
export interface LeadGroupListResponse {
  /** Lista de grupos de leads */
  data: LeadGroupResponse[];
  /** Total de grupos */
  total: number;
}
