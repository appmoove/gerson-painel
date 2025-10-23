import { useEffect } from "react";
import { PageContainer } from "../../components/layout/page-container";
import { Button } from "../../components/ui/button";
import { Plus, Loader2 } from "lucide-react";

import { useLeadsNavigation, useLeads, useLeadDetail } from "./hooks";
import { LeadsList, LeadForm, LeadView, LeadViewSkeleton } from "./components";

// ===========================
// LeadsPage Component
// ===========================

/**
 * Página principal de gerenciamento de leads
 * Coordena entre diferentes visualizações: listagem, criação, visualização e edição
 */
export default function LeadsPage() {
    const {
        // Navigation
        mode,
        leadId,
        goToList,
        goToCreate,
        goToView,
        goToEdit,
    } = useLeadsNavigation();

    const {
        // Data
        leads,
        isLoading,
        refreshLeads,
        deleteLead,
    } = useLeads();

    const {
        // Lead detail
        lead: currentLead,
        isLoading: isLoadingLead,
    } = useLeadDetail(leadId);

    // Refresh na montagem
    useEffect(() => {
        if (mode === 'list') {
            refreshLeads();
        }
    }, [mode, refreshLeads]);

    // Gerar breadcrumbs dinamicamente baseado no modo
    const getBreadcrumbs = () => {
        const base = [{ label: "Dashboard", to: "/" }];

        if (mode === 'list') {
            return [...base, { label: "Leads" }];
        }

        if (mode === 'create') {
            return [
                ...base,
                { label: "Leads", to: "/leads" },
                { label: "Novo Lead" }
            ];
        }

        if (mode === 'view' && currentLead) {
            return [
                ...base,
                { label: "Leads", to: "/leads" },
                { label: currentLead.name || 'Visualizar' }
            ];
        }

        if (mode === 'edit' && currentLead) {
            return [
                ...base,
                { label: "Leads", to: "/leads" },
                { label: currentLead.name || 'Lead', to: `/leads/${currentLead.id}` },
                { label: "Editar" }
            ];
        }

        return base;
    };

    // Informações da página baseadas no modo
    const getPageInfo = () => {
        switch (mode) {
            case 'create':
                return {
                    title: "Novo Lead",
                    subtitle: "Adicione um novo lead ao seu sistema"
                };
            case 'view':
                return {
                    title: currentLead?.name || "Visualizar Lead",
                    subtitle: "Informações detalhadas do lead"
                };
            case 'edit':
                return {
                    title: "Editar Lead",
                    subtitle: "Atualize as informações do lead"
                };
            default:
                return {
                    title: "Leads",
                    subtitle: "Gerencie todos os seus leads"
                };
        }
    };

    // Botão extra para criação (apenas na listagem)
    const getPageExtra = () => {
        if (mode === 'list') {
            return (
                <Button onClick={goToCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Lead
                </Button>
            );
        }
        return null;
    };

    const pageInfo = getPageInfo();

    // Renderização condicional baseada no modo
    if (mode === 'list') {
        return (
            <PageContainer
                title={pageInfo.title}
                subtitle={pageInfo.subtitle}
                breadcrumbs={getBreadcrumbs()}
                extra={getPageExtra()}
            >
                <LeadsList
                    leads={leads}
                    isLoading={isLoading}
                    onView={(lead) => goToView(lead.id)}
                    onEdit={goToEdit}
                    onDelete={deleteLead}
                />
            </PageContainer>
        );
    }

    if (mode === 'create') {
        return (
            <PageContainer
                title={pageInfo.title}
                subtitle={pageInfo.subtitle}
                breadcrumbs={getBreadcrumbs()}
            >
                <LeadForm onSuccess={() => goToList()} />
            </PageContainer>
        );
    }

    if (mode === 'view') {
        if (isLoadingLead) {
            return (
                <PageContainer
                    title={pageInfo.title}
                    subtitle={pageInfo.subtitle}
                    breadcrumbs={getBreadcrumbs()}
                >
                    <LeadViewSkeleton />
                </PageContainer>
            );
        }

        if (!currentLead) {
            return (
                <PageContainer
                    title="Lead não encontrado"
                    subtitle="O lead solicitado não foi encontrado"
                    breadcrumbs={getBreadcrumbs()}
                >
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            O lead que você está procurando não existe ou foi removido.
                        </p>
                        <Button onClick={goToList}>
                            Voltar para Lista
                        </Button>
                    </div>
                </PageContainer>
            );
        }

        return (
            <PageContainer
                title={pageInfo.title}
                subtitle={pageInfo.subtitle}
                breadcrumbs={getBreadcrumbs()}
            >
                <LeadView
                    lead={currentLead}
                    onEdit={() => goToEdit(currentLead.id)}
                    onBack={goToList}
                />
            </PageContainer>
        );
    }

    if (mode === 'edit') {
        if (isLoadingLead) {
            return (
                <PageContainer
                    title={pageInfo.title}
                    subtitle={pageInfo.subtitle}
                    breadcrumbs={getBreadcrumbs()}
                >
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </PageContainer>
            );
        }

        if (!currentLead) {
            return (
                <PageContainer
                    title="Lead não encontrado"
                    subtitle="O lead solicitado não foi encontrado"
                    breadcrumbs={getBreadcrumbs()}
                >
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            O lead que você está tentando editar não existe ou foi removido.
                        </p>
                        <Button onClick={goToList}>
                            Voltar para Lista
                        </Button>
                    </div>
                </PageContainer>
            );
        }

        return (
            <PageContainer
                title={pageInfo.title}
                subtitle={pageInfo.subtitle}
                breadcrumbs={getBreadcrumbs()}
            >
                <LeadForm
                    lead={currentLead}
                    onSuccess={() => goToView(currentLead.id)}
                    onCancel={() => goToView(currentLead.id)}
                />
            </PageContainer>
        );
    }

    // Fallback - não deveria chegar aqui
    return (
        <PageContainer
            title="Erro"
            subtitle="Modo de visualização não reconhecido"
            breadcrumbs={getBreadcrumbs()}
        >
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                    Ocorreu um erro inesperado. Tente novamente.
                </p>
                <Button onClick={goToList}>
                    Voltar para Lista
                </Button>
            </div>
        </PageContainer>
    );
}
