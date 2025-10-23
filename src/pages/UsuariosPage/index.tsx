import { useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Loader2 } from "lucide-react";

import { useUsuarios } from "./hooks";
import { UserFormOld, } from "./components";

// ===========================
// UsuariosPage Component
// ===========================

/**
 * Página principal de gerenciamento de usuários
 * Coordena entre diferentes visualizações: listagem, criação, visualização e edição
 */
export default function UsuariosPage() {
    const {
        // Navigation
        mode,
        userId,
        goToList,

        // Data
        isLoading,
        refreshUsers,
        currentUser,
        updateUsersList,
    } = useUsuarios();

    // Refresh dos dados sempre que a página for acessada
    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    // Gerar breadcrumbs dinamicamente baseado no modo
    const getBreadcrumbs = () => {
        const base = [{ label: "Dashboard", to: "/" }];

        if (mode === 'create') {
            return [
                ...base,
                { label: "Usuários", to: "/usuarios" },
                { label: "Novo Usuário" }
            ];
        }

        if (mode === 'edit' && currentUser) {
            return [
                ...base,
                { label: "Usuários", to: "/usuarios" },
                { label: currentUser.name || 'Usuário', to: `/usuarios/${userId}` },
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
                    title: "Novo Usuário",
                    subtitle: "Cadastre um novo usuário no sistema"
                };
            case 'edit':
                return {
                    title: "Editar Usuário",
                    subtitle: "Modifique as informações do usuário"
                };
            default:
                return {
                    title: "Usuários",
                    subtitle: "Gerencie os usuários da organização"
                };
        }
    };

    const pageInfo = getPageInfo();

    // Renderização condicional baseada no modo
    if (mode === 'create') {
        return (
            <PageContainer
                title={pageInfo.title}
                subtitle={pageInfo.subtitle}
                breadcrumbs={getBreadcrumbs()}
            >
                <UserFormOld onSuccess={() => goToList()} updateUsersList={updateUsersList} />
            </PageContainer>
        );
    }

    if (mode === 'edit') {
        if (isLoading) {
            return (
                <PageContainer
                    title={pageInfo.title}
                    subtitle={pageInfo.subtitle}
                    breadcrumbs={getBreadcrumbs()}
                >
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
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
                <UserFormOld user={currentUser || undefined} onSuccess={() => goToList()} updateUsersList={updateUsersList} />
            </PageContainer>
        );
    }

    return null;
}
