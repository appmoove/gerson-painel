import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

// Exemplo de tipo de dados
interface ExampleData {
    id: string;
    name: string;
    email: string;
    status: "active" | "inactive";
    createdAt: string;
}

// Exemplo de dados
const exampleData: ExampleData[] = [
    {
        id: "1",
        name: "João Silva",
        email: "joao@example.com",
        status: "active",
        createdAt: "2024-01-15",
    },
    {
        id: "2",
        name: "Maria Santos",
        email: "maria@example.com",
        status: "inactive",
        createdAt: "2024-01-20",
    },
];

/**
 * Exemplo de uso da DataTable refatorada
 * Demonstra todas as funcionalidades: paginação, filtros e sorting
 */
export function ExampleDataTableUsage() {
    // Definição das colunas com sorting habilitado
    const columns: ColumnDef<ExampleData>[] = [
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <Badge variant={status === "active" ? "default" : "secondary"}>
                        {status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Data de Criação",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return date.toLocaleDateString("pt-BR");
            },
        },
        {
            id: "actions",
            header: "Ações",
            cell: () => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Exemplo de DataTable Refatorada</h2>
            
            {/* Uso básico com todas as funcionalidades */}
            <DataTable
                columns={columns}
                data={exampleData}
                isLoading={false}
                showPagination={true}
                showToolbar={true}
                showSorting={true}
                showFiltering={true}
                initialPageSize={10}
                pageSizeOptions={[5, 10, 20, 30, 50]}
                toolbarPlaceholder="Filtrar usuários..."
            />
        </div>
    );
}