import { useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Loader2 } from "lucide-react";

import { useUsuarios } from "./hooks";
import { UsersList, UserForm, UserView } from "./components";
import type { UserDetails } from "@/types/user-api";

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
        goToCreate,
        goToView,
        goToEdit,

        // Data
        users,
        isLoading,
        refreshUsers,
        currentUser,
        updateUsersList
    } = useUsuarios();

    // Refresh na montagem
    useEffect(() => {
        if (mode === 'list') {
            refreshUsers();
        }
    }, [mode, refreshUsers]);

    // Gerar breadcrumbs dinamicamente baseado no modo
    const getBreadcrumbs = () => {
        const base = [{ label: "Dashboard", to: "/" }];

        if (mode === 'list') {
            return [...base, { label: "Usuários" }];
        }

        if (mode === 'create') {
            return [
                ...base,
                { label: "Usuários", to: "/usuarios" },
                { label: "Novo Usuário" }
            ];
        }

        if (mode === 'view' && currentUser) {
            return [
                ...base,
                { label: "Usuários", to: "/usuarios" },
                { label: currentUser.name || 'Visualizar' }
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
            case 'view':
                return {
                    title: currentUser?.name || "Visualizar Usuário",
                    subtitle: "Informações detalhadas do usuário"
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

    // Botões extras da página
    const getPageExtra = () => {
        if (mode === 'list') {
            return (
                <Button onClick={goToCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Usuário
                </Button>
            );
        }

        if (mode === 'view' && currentUser) {
            return (
                <Button onClick={() => goToEdit(currentUser.id)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Editar
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
                <UsersList
                    users={users}
                    isLoading={isLoading}
                    onView={goToView}
                    onEdit={(user: UserDetails) => goToEdit(user.id)}
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
                <UserForm onSuccess={() => goToList()} updateUsersList={updateUsersList} />
            </PageContainer>
        );
    }

    if (mode === 'view') {
        if (isLoading) {
            return (
                <PageContainer
                    title={pageInfo.title}
                    subtitle={pageInfo.subtitle}
                    breadcrumbs={getBreadcrumbs()}
                    extra={getPageExtra()}
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
                extra={getPageExtra()}
            >
                <UserView user={currentUser} isLoading={isLoading} />
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
                <UserForm user={currentUser || undefined} onSuccess={() => goToView(currentUser!)} updateUsersList={updateUsersList} />
            </PageContainer>
        );
    }

    return null;
}
