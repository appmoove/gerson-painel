import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CalendarClock, CheckCircle, Eye, Package, PenBox, Plus, ToggleLeft, ToggleRight, Users2, UserStar } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { MetricsCard } from "@/components/custom";
import { BasicTooltip } from "@/components/custom/basic-tooltip";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTableData } from "@/hooks/use-table-data";
import type { ColumnDef } from "@tanstack/react-table";
import type { RoutineListData } from "@/types/routine-api";
import type { RoutineChangingState } from "@/pages/RotinasPage/types";

import { routinesApi } from "@/controllers";
import { stringLimit } from "@/utils/string";

export function RoutinesList() {

    const [changingState, setChangingState] = useState<RoutineChangingState>({
        routineId: null, loading: false
    });

    const {
        data: routines,
        isLoading,
        refetch,
    } = useTableData({
        fetchFn: async () => {
            const response = await routinesApi.listRoutines();
            return {
                data: response.data || [],
            }
        },
        onError: (error) => {
            toast.error("Erro ao carregar rotinas", {
                description: error.message || 'Erro desconhecido.'
            });
        }
    })

    const handleToggleRoutineState = async (routineId: string, currentState: boolean) => {
        setChangingState({ routineId, loading: true });
        try {
            await routinesApi.updateRoutine(routineId, { active: !currentState });
            toast.success(`Rotina ${!currentState ? 'ativada' : 'desativada'} com sucesso.`);
            refetch();
        } catch (error) {
            toast.error("Erro ao atualizar estado da rotina", {
                description: (error as Error).message || 'Erro desconhecido.'
            });
        } finally {
            setChangingState({ routineId: null, loading: false });
        }
    }

    const getIsChangingState = (routineId: string) => {
        return changingState.loading && changingState.routineId === routineId;
    }

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

    const getExtraButton = () => (
        <Link to="/rotinas/nova" className="cursor-pointer">
            <Button className="cursor-pointer">
                Nova Rotina
                <Plus className="h-4 w-4" />
            </Button>
        </Link>
    )

    const getCustomRoutineData = (routineData: RoutineListData) => (
        <div className="flex gap-1 text-sm">
            <BasicTooltip content="Quantidade de leads ou alvos associados à rotina">
                <Badge className="bg-chart-1/10 text-chart-1 hover:bg-chart-1/20">
                    <Users2 className="inline-block text-chart-1" /> {routineData.targets_count}
                </Badge>
            </BasicTooltip>
            <BasicTooltip content="Quantidade de serviços e/ou produtos registrados na rotina">
                <Badge className="bg-chart-2/10 text-chart-2 hover:bg-chart-2/20">
                    <Package className="inline-block text-chart-2" /> {routineData.services_count}
                </Badge>
            </BasicTooltip>
            <BasicTooltip content="Quantidade de closers associados à rotina">
                <Badge className="bg-chart-3/10 text-chart-3 hover:bg-chart-3/20">
                    <UserStar className="inline-block text-chart-3" /> {routineData.closers_count}
                </Badge>
            </BasicTooltip>
        </div>
    )

    const getActionButtons = (routineRow: RoutineListData) => (
        <div className="flex items-center gap-2">
            <Link to={`/rotinas/${routineRow.id}`}>
                <BasicTooltip content="Visualizar">
                    <Button variant="ghost" size="icon" className="cursor-pointer hover:text-primary">
                        <Eye className="h-4 w-4" />
                    </Button>
                </BasicTooltip>
            </Link>
            <Link to={`/rotinas/${routineRow.id}/editar`}>
                <BasicTooltip content="Editar">
                    <Button variant="ghost" size="icon" className="cursor-pointer hover:text-primary">
                        <PenBox className="h-4 w-4" />
                    </Button>
                </BasicTooltip>
            </Link>
            <BasicTooltip content={routineRow.active ? "Rotina Ativa" : "Rotina Inativa"}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer hover:text-primary"
                    disabled={getIsChangingState(routineRow.id)}
                    onClick={() => handleToggleRoutineState(routineRow.id, routineRow.active)}
                >
                    {routineRow.active
                        ? <ToggleRight className="h-4 w-4 text-primary" />
                        : <ToggleLeft className="h-4 w-4" />}
                </Button>
            </BasicTooltip>
        </div>
    )

    const columns: ColumnDef<RoutineListData>[] = [
        {
            header: 'Descrição',
            accessorKey: 'description',
            enableSorting: false,
            cell: ({ row }: { row: { original: RoutineListData } }) => stringLimit(row.original.description, 25)
        },
        {
            header: 'Agente',
            accessorKey: 'agent.name',
            enableSorting: false,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableSorting: false,
            cell: ({ row }: { row: { original: RoutineListData } }) => getActiveLabel(row.original.active)
        },
        {
            header: 'Dados',
            accessorKey: '',
            enableSorting: false,
            cell: ({ row }: { row: { original: RoutineListData } }) => getCustomRoutineData(row.original)
        },
        {
            header: 'Ações',
            accessorKey: 'actions',
            enableSorting: false,
            cell: ({ row }: { row: { original: RoutineListData } }) => getActionButtons(row.original)
        }
    ]

    const breadcrumbs = [
        { label: "Dashboard", to: "/" },
        { label: "Rotinas" },
    ]

    return (
        <PageContainer
            title="Rotinas"
            subtitle="Gerencie as rotinas de sua organização."
            extra={getExtraButton()}
            breadcrumbs={breadcrumbs}
        >
            <div className="grid gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Cards de métrica vão aqui depois */}
                <MetricsCard
                    icon={CalendarClock}
                    iconColor="text-blue-500"
                    title="Total de Rotinas"
                    value={routines ? routines.length.toString() : '0'}
                    loading={isLoading}
                    tooltipContent="Total de rotinas registradas na organização."
                />
                <MetricsCard
                    icon={CheckCircle}
                    iconColor="text-green-500"
                    title="Rotinas Ativas"
                    value={routines ? routines.filter(routine => routine.active).length.toString() : '0'}
                    loading={isLoading}
                    tooltipContent="Total de rotinas ativas na organização."
                />
                <MetricsCard
                    icon={Users2}
                    iconColor="text-purple-500"
                    title="Total de Leads"
                    value={routines ? routines.filter(routine => routine.targets_count).length.toString() : '0'}
                    loading={isLoading}
                    tooltipContent="Total de leads associados às rotinas."
                />
                <MetricsCard
                    icon={UserStar}
                    iconColor="text-orange-500"
                    title="Total de Closers"
                    value={routines ? routines.filter(routine => routine.closers_count).length.toString() : '0'}
                    loading={isLoading}
                    tooltipContent="Total de closers associados às rotinas."
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Lista de Rotinas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={routines}
                        isLoading={isLoading}
                        columns={columns}
                        showPagination
                    />
                </CardContent>
            </Card>
        </PageContainer>
    )
}
