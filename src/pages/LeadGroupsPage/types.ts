// ===========================
// Lead Groups Page Types
// ===========================

import type { CreateLeadGroupResponse } from "@/types/lead-groups-api"

// Re-export para facilitar imports
export type { CreateLeadGroupResponse }

/**
 * Dados do formulário de grupo de leads (cadastro/edição)
 */
export interface LeadGroupFormData {
    /** Nome do grupo de leads */
    name: string
}

/**
 * Estado da página de grupos de leads
 */
export interface LeadGroupsPageState {
    /** Lista de grupos de leads carregados */
    leadGroups: CreateLeadGroupResponse[]
    /** Estado de carregamento */
    isLoading: boolean
    /** Erro da API */
    error: string | null
    /** Grupo selecionado para visualização */
    selectedLeadGroup: CreateLeadGroupResponse | null
}

/**
 * View modes da página
 */
export type LeadGroupViewMode = 'list' | 'create' | 'view' | 'edit'

/**
 * Parâmetros de rota
 */
export interface LeadGroupRouteParams {
    /** ID do grupo de leads (para view/edit) */
    id?: string
    /** Modo da página */
    mode: LeadGroupViewMode
}

// ===========================
// Component Props Interfaces
// ===========================

/**
 * Props do componente LeadGroupsList
 */
export interface LeadGroupsListProps {
    /** Lista de grupos de leads */
    leadGroups: CreateLeadGroupResponse[]
    /** Estado de carregamento */
    isLoading: boolean
    /** Callback para visualizar grupo */
    onView: (leadGroupId: string) => void
    /** Callback para editar grupo */
    onEdit: (leadGroup: CreateLeadGroupResponse) => void
    /** Callback para excluir grupo */
    onDelete?: (leadGroupId: string) => void
}

/**
 * Props do componente LeadGroupCreateForm
 */
export interface LeadGroupCreateFormProps {
    /** Callback quando formulário é salvo com sucesso */
    onSave: () => void
    /** Callback para cancelar */
    onCancel: () => void
    /** Estado de carregamento */
    isLoading?: boolean
}

/**
 * Props do componente LeadGroupEditForm
 */
export interface LeadGroupEditFormProps {
    /** Grupo de leads para edição */
    leadGroup: CreateLeadGroupResponse
    /** Callback quando formulário é salvo com sucesso */
    onSave: () => void
    /** Callback para cancelar */
    onCancel: () => void
    /** Estado de carregamento */
    isLoading?: boolean
}

/**
 * Props do componente LeadGroupView
 */
export interface LeadGroupViewProps {
    /** Grupo de leads para visualizar */
    leadGroup: CreateLeadGroupResponse | null
    /** Estado de carregamento */
    isLoading?: boolean
    /** Callback para excluir grupo */
    onDelete?: (leadGroupId: string) => void
}
