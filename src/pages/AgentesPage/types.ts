// ===========================
// Agentes Page Types
// ===========================

import type { CreateAgentResponse } from "@/types/agent-api"

/**
 * Dados do formulário de agente (cadastro/edição)
 * Baseado no CreateAgentRequest do backend
 */
export interface AgentFormData {
    /** Nome do agente */
    name: string
    /** Tipo do agente */
    type: 'SUPPORT' | 'SALES' | 'GENERAL'
    /** Comportamento do agente */
    behaviour: string
    /** Características do agente */
    characteristics: string
    /** ID da voz do agente */
    voice_id: string
}

/**
 * Estado da página de agentes
 */
export interface AgentsPageState {
    /** Lista de agentes carregados */
    agentes: CreateAgentResponse[]
    /** Estado de carregamento */
    isLoading: boolean
    /** Erro da API */
    error: string | null
    /** Agente selecionado para visualização */
    selectedAgent: CreateAgentResponse | null
}



/**
 * Props para componentes de agente
 */
export interface AgentComponentProps {
    /** Agente para exibir/editar */
    agent: CreateAgentResponse
    /** Callback quando agente é atualizado */
    onUpdate?: (agent: CreateAgentResponse) => void
    /** Callback quando agente é excluído */
    onDelete?: (agentId: string) => void
}

/**
 * View modes da página
 */
export type AgentViewMode = 'list' | 'create' | 'view' | 'edit'

/**
 * Parâmetros de rota
 */
export interface AgentRouteParams {
    /** ID do agente (para view/edit) */
    id?: string
    /** Modo da página */
    mode: AgentViewMode
}

// ===========================
// Component Props Interfaces
// ===========================

/**
 * Props do componente AgentsList
 */
export interface AgentsListProps {
    /** Lista de agentes */
    agentes: CreateAgentResponse[]
    /** Estado de carregamento */
    isLoading: boolean
    /** Callback para visualizar agente */
    onView: (agentId: string) => void
    /** Callback para editar agente */
    onEdit: (agent: CreateAgentResponse) => void
    /** Callback para excluir agente */
    onDelete?: (agentId: string) => void
}

/**
 * Props do componente AgentForm (DEPRECATED - usar AgentCreateForm ou AgentEditForm)
 */
export interface AgentFormProps {
    /** Agente para edição (undefined = cadastro) */
    agent?: CreateAgentResponse
    /** Callback quando formulário é salvo com sucesso */
    onSave: () => void
    /** Callback para cancelar */
    onCancel: () => void
    /** Título customizado */
    title?: string
    /** Estado de carregamento */
    isLoading?: boolean
}

/**
 * Props do componente AgentCreateForm
 */
export interface AgentCreateFormProps {
    /** Callback quando formulário é salvo com sucesso */
    onSave: () => void
    /** Callback para cancelar */
    onCancel: () => void
    /** Estado de carregamento */
    isLoading?: boolean
}

/**
 * Props do componente AgentEditForm
 */
export interface AgentEditFormProps {
    /** Agente para edição */
    agent: CreateAgentResponse
    /** Callback quando formulário é salvo com sucesso */
    onSave: () => void
    /** Callback para cancelar */
    onCancel: () => void
    /** Estado de carregamento */
    isLoading?: boolean
}

/**
 * Props do componente AgentView
 */
export interface AgentViewProps {
    /** Agente para visualizar */
    agent: CreateAgentResponse | null
    /** Estado de carregamento */
    isLoading?: boolean
    /** Callback para excluir agente */
    onDelete?: (agentId: string) => void
}
