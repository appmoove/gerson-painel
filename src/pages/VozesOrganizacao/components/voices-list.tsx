import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import type { Voice } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
import { useTableData } from "@/hooks/use-table-data";
import { voicesApi } from "@/controllers/voices-api";
import { formatDateTimeUTCToLocal } from "@/utils/string";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function VoicesList() {

    const { data, isLoading } = useTableData<Voice>({
        fetchFn: async () => {
            const response = await voicesApi.listOrganizationVoices();
            return { data: response.data || [] };
        },
        initialPage: 1,
        initialLimit: 10,
        autoFetch: true,
    });

    const getVoiceGenderLabel = (gender: string) => {
        let colorClass = 'gray';
        let label = 'Não binário';

        switch (gender) {
            case 'MALE':
                colorClass = 'blue';
                label = 'Masculino';
                break;
            case 'FEMALE':
                colorClass = 'pink';
                label = 'Feminino';
                break;
            default:
                colorClass = 'gray';
                label = 'Não binário';
                break;
        }

        return (
            <Badge variant="outline" className={`bg-${colorClass}-50 text-${colorClass}-700 border-${colorClass}-200 hover:bg-${colorClass}-100 dark:bg-${colorClass}-900/50 dark:text-${colorClass}-200 dark:border-${colorClass}-700 dark:hover:bg-${colorClass}-900/70`}>
                {label}
            </Badge>
        )
    }

    const getActionButtons = (voice: Voice) => {
        return (
            <div className="flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => console.log("Edit", voice.id)} className="cursor-pointer">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Editar</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => console.log("Delete", voice.id)} className="cursor-pointer">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => console.log("View", voice.id)} className="cursor-pointer">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                </Tooltip>
            </div>
        )
    }

    const columns: ColumnDef<Voice>[] = [
        {
            header: "Descrição",
            accessorKey: "description",
        },
        {
            header: "Gênero",
            accessorKey: "gender",
            cell: ({ row }) => getVoiceGenderLabel(row.original.gender),
        },
        {
            header: "Criado em",
            accessorKey: "created_at",
            cell: ({ row }) => formatDateTimeUTCToLocal(row.original.created_at),
        },
        {
            header: "Ações",
            accessorKey: "actions",
            cell: ({ row }) => getActionButtons(row.original),
            enableSorting: false,
            size: 100,
            maxSize: 100,
        }
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                isLoading={isLoading}
                showPagination
            />
        </>
    )
}
