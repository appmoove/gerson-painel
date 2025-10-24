// ===========================
// Leads Page Types
// ===========================

import type { LeadDetails, LeadFilters } from '../../types/leads-api';

/**
 * Dados do formulário de lead
 */
export interface LeadFormData {
  /** Nome do lead */
  name: string;
  /** Email do lead */
  email: string;
  /** Telefone do lead */
  phone: string;
}

/**
 * Estado da página de leads
 */
export interface LeadsPageState {
  /** Se está carregando */
  isLoading: boolean;
  /** Erro atual */
  error: string | null;
  /** Filtros aplicados */
  filters: LeadFilters;
}

/**
 * Modos de visualização da página
 */
export type LeadViewMode = 'list' | 'create' | 'view' | 'edit';

/**
 * Props para componente de lista de leads
 */
export interface LeadsListProps {
  /** Lista de leads */
  leads: LeadDetails[];
  /** Se está carregando */
  isLoading: boolean;
  /** Callback para visualizar lead */
  onView: (lead: LeadDetails) => void;
  /** Callback para editar lead */
  onEdit: (leadId: string) => void;
  /** Callback para deletar lead */
  onDelete: (leadId: string) => void;
}

/**
 * Props para componente de formulário de lead
 */
export interface LeadFormProps {
  /** Lead para edição (opcional) */
  lead?: LeadDetails;
  /** Callback de sucesso */
  onSuccess: () => void;
  /** Callback de cancelamento */
  onCancel?: () => void;
}

/**
 * Props para componente de visualização de lead
 */
export interface LeadViewProps {
  /** Lead para visualizar */
  lead: LeadDetails;
  /** Callback para editar */
  onEdit: () => void;
  /** Callback para voltar */
  onBack: () => void;
}
