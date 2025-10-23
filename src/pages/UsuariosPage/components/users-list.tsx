import { Link } from "react-router-dom";
import { CheckCircle, Eye, PenBox, Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/custom";
import { DataTable } from "@/components/data-table";
import { PageContainer } from "@/components/layout/page-container";
import { BasicTooltip } from "@/components/custom/basic-tooltip";
import { useTableData } from "@/hooks/use-table-data";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table"
import type { UserDetails } from "@/types";

import { usersApi } from "@/controllers";

export function UsersList() {

    const {
        data: users,
        isLoading,
    } = useTableData({
        fetchFn: async () => {
            const response = await usersApi.listUsers();
            return {
                data: response.data || [],
            }
        },
        onError: (error) => {
            toast.error("Erro ao carregar usuários", {
                description: error.message || 'Erro desconhecido.'
            });
        }
    })

    const getActiveLabel = (active: boolean) => {
        let label = 'Inativo';
        let color = 'yellow';

        if (active) {
            label = 'Ativo';
            color = 'green';
        }

        return (
            <Badge className={cn(
                `bg-${color}-100 text-${color}-800 hover:bg-${color}-200`,
                `dark:bg-${color}-900/50 dark:text-${color}-200 dark:border-${color}-700 dark:hover:bg-${color}-900/70`,
                'transition-all duration-300'
            )}>
                {label}
            </Badge>
        )
    }

    const getActionButtons = (userRow: UserDetails) => {
        return (
            <div className="flex items-center gap-2">
                <Link to={`/usuarios/${userRow.id}`}>
                    <BasicTooltip content="Visualizar">
                        <Button variant="outline" size="icon" className="cursor-pointer hover:text-primary">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </BasicTooltip>
                </Link>
                <Link to={`/usuarios/${userRow.id}/editar`}>
                    <BasicTooltip content="Editar">
                        <Button variant="outline" size="icon" className="cursor-pointer hover:text-primary">
                            <PenBox className="h-4 w-4" />
                        </Button>
                    </BasicTooltip>
                </Link>
            </div>
        )
    }

    const columns: ColumnDef<UserDetails>[] = [
        {
            header: 'Nome',
            accessorKey: 'name',
            cell: ({ row }: { row: { original: UserDetails } }) => (
                <Link to={`/usuarios/${row.original.id}`} className="hover:underline hover:text-primary">
                    {row.original.name}
                </Link>
            ),
            enableSorting: false,
        },
        {
            header: 'Email',
            accessorKey: 'email',
            enableSorting: false,
        },
        {
            header: 'Status',
            accessorKey: 'isActive',
            cell: ({ row }: { row: { original: UserDetails } }) => (
                getActiveLabel(row.original.active || false)
            ),
            enableSorting: false,
        },
        {
            header: 'Ações',
            accessorKey: 'actions',
            cell: ({ row }: { row: { original: UserDetails } }) => (
                getActionButtons(row.original)
            ),
            enableSorting: false,
        }
    ];

    const getExtraButton = () => {
        return (
            <Link
                to="/usuarios/novo"
                className="cursor-pointer"
            >
                <Button>
                    Novo Usuário
                    <Plus className="h-4 w-4" />
                </Button>
            </Link>
        )
    }

    const breadcrumbs = [
        { label: 'Dashboard', href: '/' },
        { label: 'Usuários' },
    ];

    return (
        <PageContainer
            title="Usuários"
            subtitle="Gerencie os usuários da sua organização."
            extra={getExtraButton()}
            breadcrumbs={breadcrumbs}
        >
            <div className="grid gap-6 mb-4 lg:grid-cols-2">
                <MetricsCard
                    icon={Users}
                    iconColor="text-blue-500"
                    title="Total de Usuários"
                    value={users ? users.length.toString() : '0'}
                    loading={isLoading}
                    tooltipContent="Total de usuários registrados na organização."
                />
                <MetricsCard
                    icon={CheckCircle}
                    iconColor="text-green-500"
                    title="Usuários Ativos"
                    value={users ? users.filter(user => user.active).length.toString() : '0'}
                    loading={isLoading}
                    tooltipContent="Total de usuários ativos na organização."
                />
            </div>
            <DataTable
                data={users}
                columns={columns}
                isLoading={isLoading}
                className="bg-card"
            />
        </PageContainer >
    );
}
