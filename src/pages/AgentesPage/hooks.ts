import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import { agentsApi } from "@/controllers/agents-api"
import { voicesApi } from "@/controllers/voices-api"
import { useToast } from "@/hooks/use-toast"
import type { CreateAgentResponse, Voice } from "@/types/agent-api"
import { AGENT_FORM_DEFAULTS } from "@/constants/agent"

import { agentSchema } from "./validation"
import type { AgentFormData, AgentsPageState, AgentViewMode } from "./types"

// ===========================
// Agentes List Hook
// ===========================

/**
 * Hook para gerenciar a listagem de agentes
 */
export function useAgentsList() {
    const { toast } = useToast()
    const [state, setState] = useState<AgentsPageState>({
        agentes: [],
        isLoading: true,
        error: null,
        selectedAgent: null
    })

    const fetchAgentes = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        agentsApi.listAgents()
            .then(response => {
                // Verifica se há erro na resposta
                if (response.error) {
                    throw new Error(response.error.message as string || 'Erro da API')
                }

                // A API retorna diretamente um array de agentes
                const agentes = response.data ?? [];

                setState(prev => ({
                    ...prev,
                    agentes,
                    isLoading: false
                }));

            })
            .catch(error => {
                console.error('Erro ao buscar agentes:', error);
                const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar agentes'

                // Toast de erro para carregamento
                toast.error("Erro ao carregar agentes", {
                    description: errorMessage,
                })

                setState(prev => ({
                    ...prev,
                    error: errorMessage,
                    isLoading: false
                }))
            })
    }, [toast])

    const refreshAgents = useCallback(() => {
        fetchAgentes()
    }, [fetchAgentes])

    useEffect(() => {
        fetchAgentes()
    }, [])

    return {
        ...state,
        refreshAgents,
        setSelectedAgent: (agent: CreateAgentResponse | null) =>
            setState(prev => ({ ...prev, selectedAgent: agent }))
    }
}

// ===========================
// Agent Form Hook
// ===========================

/**
 * Hook para formulário de agente (cadastro/edição)
 */
export function useAgentForm(agent?: CreateAgentResponse) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [voices, setVoices] = useState<Voice[]>([])

    const form = useForm<AgentFormData>({
        resolver: zodResolver(agentSchema),
        defaultValues: {
            name: agent?.name || "",
            type: agent?.type || AGENT_FORM_DEFAULTS.type,
            behaviour: agent?.behaviour || "",
            characteristics: agent?.characteristics || "",
            voice_id: agent?.voice_id || AGENT_FORM_DEFAULTS.voice_id
        }
    })

    // Carregar vozes quando o componente montar
    useEffect(() => {
        const loadVoices = async () => {
            try {
                const response = await voicesApi.listOrganizationVoices()
                if (response.error) {
                    console.error('Erro ao carregar vozes:', response.error.message)
                    return
                }

                const voicesData = response.data || []
                setVoices(voicesData)
            } catch (error) {
                console.error('Erro ao carregar vozes:', error)
            }
        }

        loadVoices()
    }, [])

    const onSubmit = useCallback((data: AgentFormData) => {
        setIsSubmitting(true)
        setSubmitError(null)

        const processSubmit = () => {
            if (agent?.id) {
                // Atualização de agente existente
                return agentsApi.updateAgent(agent.id, {
                    name: data.name,
                    type: data.type,
                    behaviour: data.behaviour,
                    characteristics: data.characteristics,
                    voice_id: data.voice_id
                })
            } else {
                // Criação de novo agente
                return agentsApi.createAgent({
                    name: data.name,
                    type: data.type,
                    behaviour: data.behaviour,
                    characteristics: data.characteristics,
                    voice_id: data.voice_id
                })
            }
        }

        return processSubmit()
            .then(response => {
                if (response.error) {
                    const errorMsg = Array.isArray(response.error.message)
                        ? response.error.message.join(', ')
                        : response.error.message;
                    throw new Error(errorMsg || 'Erro ao salvar agente')
                }

                // Mensagens de sucesso com toast
                if (agent?.id) {
                    // Edição
                    toast.success("Agente atualizado!", {
                        description: `${data.name} foi atualizado com sucesso.`,
                    })
                } else {
                    // Criação
                    toast.success("Agente criado!", {
                        description: `${data.name} foi criado com sucesso.`,
                    })
                }

                // Resetar form após sucesso na criação
                if (!agent?.id) {
                    form.reset()
                }

                setIsSubmitting(false)
                return { success: true }
            })
            .catch(error => {
                const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar agente'

                // Toast de erro
                toast.error("Erro ao salvar agente", {
                    description: errorMessage,
                })

                setSubmitError(errorMessage)
                setIsSubmitting(false)
                return { success: false, error: errorMessage }
            })
    }, [agent, form, toast])

    return {
        form,
        isSubmitting,
        submitError,
        onSubmit,
        clearError: () => setSubmitError(null),
        voices
    }
}



// ===========================
// Navigation Hook
// ===========================

/**
 * Hook para navegação interna da página de agentes
 */
export function useAgentsNavigation() {
    const navigate = useNavigate()
    const params = useParams<{ id: string }>()
    const location = useLocation()

    // Determina o modo atual baseado na rota
    const getCurrentMode = useCallback((): AgentViewMode => {
        const path = location.pathname

        if (path.endsWith('/novo')) return 'create'
        if (params.id && path.endsWith('/editar')) return 'edit'
        if (params.id) return 'view'
        return 'list'
    }, [location.pathname, params.id])

    const mode = getCurrentMode()

    // Navegação
    const goToList = useCallback(() => {
        navigate('/agentes')
    }, [navigate])

    const goToCreate = useCallback(() => {
        navigate('/agentes/novo')
    }, [navigate])

    const goToView = useCallback((agentId: string) => {
        navigate(`/agentes/${agentId}`)
    }, [navigate])

    const goToEdit = useCallback((agentId: string) => {
        navigate(`/agentes/${agentId}/editar`)
    }, [navigate])

    return {
        mode,
        agentId: params.id,
        goToList,
        goToCreate,
        goToView,
        goToEdit
    }
}

// ===========================
// Agent Detail Hook
// ===========================

/**
 * Hook para buscar dados detalhados de um agente específico
 */
export function useAgentDetail(agentId?: string) {
    const [agent, setAgent] = useState<CreateAgentResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAgent = useCallback(async (id: string) => {
        if (!id) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await agentsApi.getAgent(id)

            if (response.error) {
                throw new Error(response.error.message as string || 'Erro ao buscar agente')
            }

            // A API retorna diretamente o agente em response.data
            if (response.data) {
                setAgent(response.data)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar agente'
            setError(errorMessage)
            console.error('Erro ao buscar agente:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (agentId) {
            fetchAgent(agentId)
        } else {
            setAgent(null)
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentId])

    return {
        agent,
        isLoading,
        error,
        refetch: () => agentId ? fetchAgent(agentId) : Promise.resolve()
    }
}

// ===========================
// Main Agentes Hook
// ===========================

/**
 * Hook principal que integra toda a lógica da página de agentes
 */
export function useAgentes() {
    const navigation = useAgentsNavigation()
    const agentsList = useAgentsList()
    const agentDetail = useAgentDetail(navigation.agentId)
    const agentDelete = useAgentDelete()

    // Usa apenas dados da requisição específica quando em modo view/edit
    // Para listagem, não precisa de currentAgent
    const currentAgent = (navigation.mode === 'view' || navigation.mode === 'edit')
        ? agentDetail.agent
        : null

    // Recarrega agentes sempre que acessar a listagem
    useEffect(() => {
        if (navigation.mode === 'list') {
            agentsList.refreshAgents()
        }
    }, [navigation.mode])

    // Recarrega dados do agente sempre que acessar view/edit
    useEffect(() => {
        if ((navigation.mode === 'view' || navigation.mode === 'edit') && navigation.agentId) {
            agentDetail.refetch()
        }
    }, [navigation.mode, navigation.agentId])

    // Handler para exclusão de agente
    const handleDeleteAgent = useCallback(async (agentId: string) => {
        const result = await agentDelete.deleteAgent(agentId)
        if (result.success) {
            // Recarrega a lista após exclusão
            agentsList.refreshAgents()
            // Se estava visualizando/editando o agente excluído, volta para lista
            if (navigation.agentId === agentId) {
                navigation.goToList()
            }
        }
    }, [agentDelete, agentsList, navigation])

    return {
        // Navigation
        ...navigation,

        // Agents List
        agentes: agentsList.agentes,
        isLoading: navigation.mode === 'list' ? agentsList.isLoading : agentDetail.isLoading,
        error: navigation.mode === 'list' ? agentsList.error : agentDetail.error,
        refreshAgents: agentsList.refreshAgents,

        // Current Agent (apenas para view/edit)
        currentAgent,
        refetchAgent: agentDetail.refetch,

        // Delete functionality
        deleteAgent: handleDeleteAgent,
        isDeleting: agentDelete.isDeleting
    }
}

// ===========================
// Voice Data Hook
// ===========================

/**
 * Hook para buscar dados da voz de um agente específico
 * Usado para preview de áudio na visualização
 */
export function useAgentVoice(voiceId?: string) {
    const [voice, setVoice] = useState<Voice | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchVoice = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await voicesApi.listOrganizationVoices()
            
            if (response.error) {
                setError(typeof response.error.message === 'string' ? response.error.message : 'Erro desconhecido')
                return
            }

            const voices = response.data || []
            const foundVoice = voices.find(v => v.id === id)
            
            if (foundVoice) {
                setVoice(foundVoice)
            } else {
                setError('Voz não encontrada')
            }
        } catch (err) {
            setError('Erro ao carregar dados da voz')
            console.error('Erro ao buscar voz:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (voiceId) {
            fetchVoice(voiceId)
        } else {
            setVoice(null)
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voiceId])

    return {
        voice,
        isLoading,
        error,
        refetch: () => voiceId ? fetchVoice(voiceId) : Promise.resolve()
    }
}

// ===========================
// Agent Delete Hook
// ===========================

/**
 * Hook para exclusão de agentes
 * Gerencia estado de loading e erros durante exclusão
 */
export function useAgentDelete() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const { toast } = useToast()

    const deleteAgent = useCallback(async (agentId: string) => {
        setIsDeleting(true)
        setDeleteError(null)

        try {
            const response = await agentsApi.deleteAgent(agentId)
            
            if (response.error) {
                const errorMessage = typeof response.error.message === 'string' ? response.error.message : 'Erro desconhecido'
                setDeleteError(errorMessage)
                toast.error("Erro ao excluir agente", {
                    description: errorMessage,
                })
                return { success: false, error: errorMessage }
            }

            toast.success("Agente excluído!", {
                description: "O agente foi excluído com sucesso"
            })

            return { success: true }
        } catch (err) {
            const errorMessage = 'Erro ao excluir agente'
            setDeleteError(errorMessage)
            toast.error("Erro ao excluir agente", {
                description: errorMessage,
            })
            return { success: false, error: errorMessage }
        } finally {
            setIsDeleting(false)
        }
    }, [toast])

    return {
        deleteAgent,
        isDeleting,
        deleteError,
        clearError: () => setDeleteError(null)
    }
}
