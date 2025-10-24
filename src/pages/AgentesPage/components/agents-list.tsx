import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { CreateAgentResponse } from "@/types/agent-api"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { stringLimit } from "@/utils/string"
import { AGENT_TYPE_LABELS } from "@/constants/agent"

// ===========================
// Helper Functions
// ===========================

const getTypeLabel = (type: 'SUPPORT' | 'SALES' | 'GENERAL') => {
    const labels = {
        SUPPORT: { label: "Suporte", className: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-900/70" },
        SALES: { label: "Vendas", className: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-900/70" },
        GENERAL: { label: "Geral", className: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/50 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-900/70" }
    }
    
    const config = labels[type]
    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    )
}

// ===========================
// AgentsList Component
// ===========================

interface AgentsListProps {
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
 * Componente de listagem de agentes
 * Reutiliza o DataTable existente com ações customizadas
 */
export function AgentsList({
    agentes,
    isLoading,
    onView,
    onEdit,
    onDelete,
}: AgentsListProps) {

    // Definição das colunas da tabela
    const columns: ColumnDef<CreateAgentResponse>[] = [
        {
            accessorKey: "name",
            header: "Nome do agente",
        },
        {
            accessorKey: "type",
            header: "Tipo",
            cell: ({ row }) => getTypeLabel(row.original.type),
        },
        {
            accessorKey: "behaviour",
            header: "Comportamento",
            cell: ({ row }) => stringLimit(row.original.behaviour, 30),
        },
        {
            accessorKey: "characteristics",
            header: "Características",
            cell: ({ row }) => stringLimit(row.original.characteristics, 30),
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onView(row.original.id)}
                                title="Visualizar"
                                className="cursor-pointer"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Visualizar</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(row.original)}
                                title="Editar"
                                className="cursor-pointer"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Editar</p>
                        </TooltipContent>
                    </Tooltip>

                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(row.original.id)}
                            title="Excluir"
                            className="text-destructive hover:text-destructive cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-4">
            {/* Tabela de agentes */}
            <DataTable
                columns={columns}
                data={agentes}
                isLoading={isLoading}
                showPagination
            />
        </div>
    )
}
