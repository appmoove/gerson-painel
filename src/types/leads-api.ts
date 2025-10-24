// ===========================
// Leads API Types
// ===========================

/**
 * Informações do grupo de leads
 */
export interface LeadGroupInfo {
  /** ID do grupo */
  id: string;
  /** Nome do grupo */
  name: string;
}

/**
 * Dados básicos de um lead
 */
export interface LeadResponse {
  /** ID do lead */
  id: string;
  /** ID da organização */
  organization_id: string;
  /** Nome do lead */
  name: string | null;
  /** Email do lead */
  email: string | null;
  /** Telefone do lead */
  phone: string | null;
  /** Grupos que o lead pertence */
  groups: LeadGroupInfo[];
  /** Data de criação */
  created_at: string;
  /** Data de atualização */
  updated_at: string;
}

/**
 * Dados completos de um lead (inclui dados adicionais)
 */
export interface LeadDetails extends LeadResponse {
  /** Dados adicionais do lead */
  lead_data: any;
}

/**
 * Dados para criação de um lead
 */
export interface CreateLeadRequest {
  /** Nome do lead */
  name?: string;
  /** Email do lead */
  email?: string;
  /** Telefone do lead */
  phone?: string;
  /** IDs dos grupos que o lead pertence */
  groups?: string[];
}

/**
 * Resposta da criação de um lead
 */
export interface CreateLeadResponse extends LeadResponse {}

/**
 * Dados para atualização de um lead
 */
export interface UpdateLeadRequest {
  /** Nome do lead */
  name?: string;
  /** Email do lead */
  email?: string;
  /** Telefone do lead */
  phone?: string;
  /** IDs dos grupos que o lead pertence */
  groups?: string[];
}

/**
 * Resposta da atualização de um lead
 */
export interface UpdateLeadResponse extends LeadResponse {}

/**
 * Filtros para listagem de leads
 */
export interface LeadFilters {
  /** Filtrar por nome */
  name?: string;
  /** Filtrar por email */
  email?: string;
  /** Filtrar por telefone */
  phone?: string;
}

/**
 * Parâmetros para listagem de leads
 */
export interface LeadListParams {
  /** Página atual */
  page?: number;
  /** Limite de itens por página */
  limit?: number;
  /** Filtros de busca */
  filters?: LeadFilters;
}

/**
 * Resposta da listagem de leads
 */
export interface LeadListResponse {
  /** Lista de leads */
  data: LeadDetails[];
  /** Total de leads */
  total: number;
  /** Página atual */
  page: number;
  /** Limite por página */
  limit: number;
}
