import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { useLeadGroups } from "./hooks"
import { LeadGroupsList, LeadGroupCreateForm, LeadGroupEditForm, LeadGroupView } from "./components"

// ===========================
// LeadGroupsPage Component
// ===========================

/**
 * Página principal para gerenciamento de grupos de leads
 * Suporta listagem, criação, visualização e edição
 */
export function LeadGroupsPage() {
    const {
        mode,
        leadGroups,
        isLoading,
        error,
        currentLeadGroup,
        goToList,
        goToCreate,
        goToView,
        goToEdit,
        deleteLeadGroup,
        isDeleting
    } = useLeadGroups()

    // Determina breadcrumbs baseado no modo atual
    const getBreadcrumbs = () => {
        const base = [{ label: "Dashboard", to: "/" }]

        switch (mode) {
            case 'create':
                return [
                    ...base,
                    { label: "Grupos de Leads", to: "/lead-groups" },
                    { label: "Novo Grupo" }
                ]
            case 'view':
                return [
                    ...base,
                    { label: "Grupos de Leads", to: "/lead-groups" },
                    { label: currentLeadGroup?.name || 'Visualizar' }
                ]
            case 'edit':
                return [
                    ...base,
                    { label: "Grupos de Leads", to: "/lead-groups" },
                    { label: currentLeadGroup?.name || 'Grupo', to: `/lead-groups/${currentLeadGroup?.id}` },
                    { label: "Editar" }
                ]
            default:
                return [...base, { label: "Grupos de Leads" }]
        }
    }

    // Títulos e subtítulos por modo
    const getPageInfo = () => {
        switch (mode) {
            case 'create':
                return {
                    title: "Novo Grupo de Leads",
                    subtitle: "Crie um novo grupo para organizar seus leads"
                }
            case 'view':
                return {
                    title: currentLeadGroup?.name || "Visualizar Grupo",
                    subtitle: "Informações detalhadas do grupo de leads"
                }
            case 'edit':
                return {
                    title: "Editar Grupo de Leads",
                    subtitle: "Atualize as informações do grupo"
                }
            default:
                return {
                    title: "Grupos de Leads",
                    subtitle: "Gerencie seus grupos de leads e organize seus contatos"
                }
        }
    }

    // Botão extra para criação (apenas na listagem)
    const getPageExtra = () => {
        if (mode === 'list') {
            return (
                <Button onClick={goToCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Grupo
                </Button>
            )
        }
        return null
    }

    // Renderiza conteúdo baseado no modo atual
    const renderContent = () => {
        switch (mode) {
            case 'create':
                return (
                    <LeadGroupCreateForm
                        onSave={goToList}
                        onCancel={goToList}
                        isLoading={isLoading}
                    />
                )

            case 'edit':
                // Se está carregando, mostra loading
                if (isLoading) {
                    return (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                Carregando grupo...
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Buscando informações do grupo de leads.
                            </p>
                        </div>
                    )
                }

                // Se não está carregando e não tem grupo, mostra erro
                if (!currentLeadGroup) {
                    return (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                Grupo não encontrado
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                O grupo de leads solicitado não foi encontrado.
                            </p>
                            <Button onClick={goToList}>
                                Voltar para Lista
                            </Button>
                        </div>
                    )
                }

                return (
                    <LeadGroupEditForm
                        leadGroup={currentLeadGroup}
                        onSave={goToList}
                        onCancel={goToList}
                        isLoading={isLoading}
                    />
                )

            case 'view':
                // Se está carregando, mostra loading
                if (isLoading) {
                    return (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                Carregando grupo...
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Buscando informações do grupo de leads.
                            </p>
                        </div>
                    )
                }

                return (
                    <LeadGroupView
                        leadGroup={currentLeadGroup}
                        isLoading={isLoading}
                        onDelete={deleteLeadGroup}
                    />
                )

            case 'list':
            default:
                return (
                    <LeadGroupsList
                        leadGroups={leadGroups}
                        isLoading={isLoading}
                        onView={goToView}
                        onEdit={goToEdit}
                        onDelete={deleteLeadGroup}
                    />
                )
        }
    }

    return (
        <PageContainer
            title={getPageInfo().title}
            subtitle={getPageInfo().subtitle}
            breadcrumbs={getBreadcrumbs()}
            extra={getPageExtra()}
        >
            {renderContent()}
        </PageContainer>
    )
}

export default LeadGroupsPage
