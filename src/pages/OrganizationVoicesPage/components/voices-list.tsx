import { AudioLines } from "lucide-react";

import { AudioPlayer } from "@/components/custom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { voicesApi } from "@/controllers/voices-api";
import { useTableData } from "@/hooks/use-table-data";
import { cn } from "@/lib/utils";

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
                    `bg-${colorClass}-50 text-${colorClass}-700 border-${colorClass}-200`,
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
                    <div className="block items-center min-h-16">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
                [...Array(8)].map((_, index) => <Skeleton key={index} className="h-36 w-full" />)
            ) : (
                data?.map((voice) => getVoiceCard(voice))
            )}
        </div>
    )
}
