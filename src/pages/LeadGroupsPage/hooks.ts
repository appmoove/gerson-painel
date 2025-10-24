import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams, useLocation } from "react-router-dom"

import { leadGroupsApi } from "@/controllers/lead-groups-api"
import { useToast } from "@/hooks/use-toast"
import type { CreateLeadGroupResponse } from "@/types/lead-groups-api"

import { leadGroupSchema } from "./validation"
import type { LeadGroupFormData, LeadGroupsPageState, LeadGroupViewMode } from "./types"

// ===========================
// Navigation Hook
// ===========================

/**
 * Hook para gerenciar navegação entre modos da página
 */
export function useLeadGroupsNavigation() {
    const navigate = useNavigate()
    const params = useParams<{ id?: string }>()
    const location = useLocation()

    // Determina o modo atual baseado na URL
    const getCurrentMode = (): LeadGroupViewMode => {
        const path = location.pathname
        
        if (path.includes('/create')) return 'create'
        if (path.includes('/edit')) return 'edit'
        if (params.id) return 'view'
        return 'list'
    }

    const mode = getCurrentMode()
    const leadGroupId = params.id

    const goToList = useCallback(() => {
        navigate('/lead-groups')
    }, [navigate])

    const goToCreate = useCallback(() => {
        navigate('/lead-groups/create')
    }, [navigate])

    const goToView = useCallback((id: string) => {
        navigate(`/lead-groups/${id}`)
    }, [navigate])

    const goToEdit = useCallback((id: string) => {
        navigate(`/lead-groups/${id}/edit`)
    }, [navigate])

    return {
        mode,
        leadGroupId,
        goToList,
        goToCreate,
        goToView,
        goToEdit
    }
}

// ===========================
// Lead Groups List Hook
// ===========================

/**
 * Hook para gerenciar lista de grupos de leads
 */
export function useLeadGroupsList() {
    const [leadGroups, setLeadGroups] = useState<CreateLeadGroupResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLeadGroups = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await leadGroupsApi.listLeadGroups()
            
            if (response.error) {
                setError(response.error.message)
                return
            }

            setLeadGroups(response.data || [])
        } catch (err) {
            setError('Erro ao carregar grupos de leads')
            console.error('Erro ao buscar grupos de leads:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLeadGroups()
    }, [fetchLeadGroups])

    return {
        leadGroups,
        isLoading,
        error,
        refreshLeadGroups: fetchLeadGroups
    }
}

// ===========================
// Lead Group Form Hook
// ===========================

/**
 * Hook para gerenciar formulário de grupo de leads
 */
export function useLeadGroupForm(leadGroup?: CreateLeadGroupResponse) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const form = useForm<LeadGroupFormData>({
        resolver: zodResolver(leadGroupSchema),
        defaultValues: {
            name: leadGroup?.name || ""
        }
    })

    const onSubmit = useCallback((data: LeadGroupFormData) => {
        setIsSubmitting(true)
        setSubmitError(null)

        const processSubmit = () => {
            if (leadGroup?.id) {
                return leadGroupsApi.updateLeadGroup(leadGroup.id, {
                    name: data.name
                })
            } else {
                return leadGroupsApi.createLeadGroup({
                    name: data.name
                })
            }
        }

        processSubmit()
            .then(response => {
                if (response.error) {
                    setSubmitError(response.error.message)
                    toast.error("Erro ao salvar grupo de leads", {
                        description: response.error.message,
                    })
                } else {
                    if (leadGroup?.id) {
                        toast.success("Grupo de leads atualizado!", {
                            description: `${data.name} foi atualizado com sucesso.`,
                        })
                    } else {
                        toast.success("Grupo de leads criado!", {
                            description: `${data.name} foi criado com sucesso.`,
                        })
                    }
                    form.reset()
                    return { success: true }
                }
            })
            .catch(err => {
                const errorMessage = 'Erro ao salvar grupo de leads'
                setSubmitError(errorMessage)
                toast.error("Erro ao salvar grupo de leads", {
                    description: errorMessage,
                })
                return { success: false, error: errorMessage }
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }, [leadGroup, form, toast])

    return {
        form,
        isSubmitting,
        submitError,
        onSubmit,
        clearError: () => setSubmitError(null)
    }
}

// ===========================
// Lead Group Detail Hook
// ===========================

/**
 * Hook para buscar detalhes de um grupo específico
 */
export function useLeadGroupDetail(leadGroupId?: string) {
    const [leadGroup, setLeadGroup] = useState<CreateLeadGroupResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLeadGroup = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await leadGroupsApi.getLeadGroup(id)
            
            if (response.error) {
                setError(response.error.message)
                return
            }

            setLeadGroup(response.data)
        } catch (err) {
            setError('Erro ao carregar grupo de leads')
            console.error('Erro ao buscar grupo de leads:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (leadGroupId) {
            fetchLeadGroup(leadGroupId)
        } else {
            setLeadGroup(null)
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadGroupId])

    return {
        leadGroup,
        isLoading,
        error,
        refetch: () => leadGroupId ? fetchLeadGroup(leadGroupId) : Promise.resolve()
    }
}

// ===========================
// Lead Group Delete Hook
// ===========================

/**
 * Hook para exclusão de grupos de leads
 */
export function useLeadGroupDelete() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const { toast } = useToast()

    const deleteLeadGroup = useCallback(async (leadGroupId: string) => {
        setIsDeleting(true)
        setDeleteError(null)

        try {
            const response = await leadGroupsApi.deleteLeadGroup(leadGroupId)
            
            if (response.error) {
                const errorMessage = typeof response.error.message === 'string' ? response.error.message : 'Erro desconhecido'
                setDeleteError(errorMessage)
                toast.error("Erro ao excluir grupo de leads", {
                    description: errorMessage,
                })
                return { success: false, error: errorMessage }
            }

            toast.success("Grupo de leads excluído!", {
                description: "O grupo de leads foi excluído com sucesso"
            })

            return { success: true }
        } catch (err) {
            const errorMessage = 'Erro ao excluir grupo de leads'
            setDeleteError(errorMessage)
            toast.error("Erro ao excluir grupo de leads", {
                description: errorMessage,
            })
            return { success: false, error: errorMessage }
        } finally {
            setIsDeleting(false)
        }
    }, [toast])

    return {
        deleteLeadGroup,
        isDeleting,
        deleteError,
        clearError: () => setDeleteError(null)
    }
}

// ===========================
// Main Lead Groups Hook
// ===========================

/**
 * Hook principal que integra toda a lógica da página de grupos de leads
 */
export function useLeadGroups() {
    const navigation = useLeadGroupsNavigation()
    const leadGroupsList = useLeadGroupsList()
    const leadGroupDetail = useLeadGroupDetail(navigation.leadGroupId)
    const leadGroupDelete = useLeadGroupDelete()

    // Usa apenas dados da requisição específica quando em modo view/edit
    const currentLeadGroup = (navigation.mode === 'view' || navigation.mode === 'edit')
        ? leadGroupDetail.leadGroup
        : null

    // Recarrega grupos sempre que acessar a listagem
    useEffect(() => {
        if (navigation.mode === 'list') {
            leadGroupsList.refreshLeadGroups()
        }
    }, [navigation.mode])

    // Recarrega dados do grupo sempre que acessar view/edit
    useEffect(() => {
        if ((navigation.mode === 'view' || navigation.mode === 'edit') && navigation.leadGroupId) {
            leadGroupDetail.refetch()
        }
    }, [navigation.mode, navigation.leadGroupId])

    // Handler para exclusão de grupo
    const handleDeleteLeadGroup = useCallback(async (leadGroupId: string) => {
        const result = await leadGroupDelete.deleteLeadGroup(leadGroupId)
        if (result.success) {
            // Recarrega a lista após exclusão
            leadGroupsList.refreshLeadGroups()
            // Se estava visualizando/editando o grupo excluído, volta para lista
            if (navigation.leadGroupId === leadGroupId) {
                navigation.goToList()
            }
        }
    }, [leadGroupDelete, leadGroupsList, navigation])

    return {
        // Navigation
        ...navigation,

        // Lead Groups List
        leadGroups: leadGroupsList.leadGroups,
        isLoading: navigation.mode === 'list' ? leadGroupsList.isLoading : leadGroupDetail.isLoading,
        error: navigation.mode === 'list' ? leadGroupsList.error : leadGroupDetail.error,
        refreshLeadGroups: leadGroupsList.refreshLeadGroups,

        // Current Lead Group (apenas para view/edit)
        currentLeadGroup,
        refetchLeadGroup: leadGroupDetail.refetch,

        // Delete functionality
        deleteLeadGroup: handleDeleteLeadGroup,
        isDeleting: leadGroupDelete.isDeleting
    }
}
