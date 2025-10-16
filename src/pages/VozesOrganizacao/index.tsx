import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AudioLines } from "lucide-react";
import VoicesList from "./components/voices-list";

export default function VozesOrganizacaoPage() {

    const getBreadcrumbs = [
        { label: "Dashboard", to: "/" },
        { label: "Vozes" }
    ]

    const getPageExtra = () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button disabled>
                    <AudioLines />
                    Treinar Voz
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Treinar Voz</p>
            </TooltipContent>
        </Tooltip>
    );

    return (
        <PageContainer
            title="Vozes"
            subtitle="Lista de todas as vozes disponíveis para uso"
            breadcrumbs={getBreadcrumbs}
            extra={getPageExtra()}
        >
            <VoicesList />
        </PageContainer>
    )
}
