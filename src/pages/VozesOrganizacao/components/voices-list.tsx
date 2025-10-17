import { AudioLines, Edit, Eye, Trash } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { AudioPlayer } from "@/components/custom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { voicesApi } from "@/controllers/voices-api";
import { useTableData } from "@/hooks/use-table-data";
import { cn } from "@/lib/utils";
import { formatDateTimeUTCToLocal } from "@/utils/string";

import type { Voice } from "@/types";

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

    const getVoiceGenderLabel = ({
        gender,
        className,
    }: {
        gender: 'MALE' | 'FEMALE' | 'NON_BINARY'
        className?: string
    }) => {
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
            <Badge
                variant="outline"
                className={cn(
                    `bg-${colorClass}-50 text-${colorClass}-700 border-${colorClass}-200 hover:bg-${colorClass}-100`,
                    `dark:bg-${colorClass}-900/50 dark:text-${colorClass}-200 dark:border-${colorClass}-700 dark:hover:bg-${colorClass}-900/70`,
                    className
                )}>
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
            cell: ({ row }) => getVoiceGenderLabel({ gender: row.original.gender }),
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

    const getCharacteristicBadge = ({ key, value, className }: { key: string, value: string, className?: React.HTMLAttributes<HTMLDivElement>['className'] }) => {
        let colorClass = 'muted-foreground';
        let label = value;

        switch (key) {
            case 'age':
                colorClass = 'yellow';
                label = `${value} anos`;
                break;
            case 'accent':
                if (value === 'Brazilian') {
                    colorClass = 'blue';
                    label = 'Brasileiro';
                }
                if (value === 'American') {
                    colorClass = 'blue';
                    label = 'Americano';
                }
                if (value === 'Mexican') {
                    colorClass = 'blue';
                    label = 'Mexicano';
                }
                break;
            default:
                colorClass = 'muted-foreground';
                label = value;
                break;
        }

        return (
            <Badge
                variant="outline"
                className={cn(
                    `bg-${colorClass}-50 text-${colorClass}-700 border-${colorClass}-200 hover:bg-${colorClass}-100`,
                    `dark:bg-${colorClass}-900/50 dark:text-${colorClass}-200 dark:border-${colorClass}-700 dark:hover:bg-${colorClass}-900/70`,
                    className
                )}>
                {label}
            </Badge>
        )
    }

    const getVoiceCard = (voice: Voice) => {
        return (
            <Card className="gap-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {/* Default Icon */}
                        <AudioLines className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{voice.description}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Gender and Characteristics */}
                    <div className="block items-center">
                        {getVoiceGenderLabel({ gender: voice.gender, className: 'mt-2 mr-1' })}
                        {Object.entries(voice.characteristics).map(([key, value]) => (
                            getCharacteristicBadge({ key, value, className: 'mt-2 mr-1' })
                        ))}
                    </div>
                    {/* Audio Preview */}
                    <div className="mt-4">
                        <AudioPlayer voice={voice} />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                isLoading={isLoading}
                showPagination
            />
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (

                    <Skeleton className="h-36 w-full" />
                ) : (
                    data?.map((voice) => getVoiceCard(voice))
                )}
            </div>
        </>
    )
}
