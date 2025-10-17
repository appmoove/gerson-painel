import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { AudioLines } from "lucide-react";
import VoicesList from "./components/voices-list";

export default function VozesOrganizacaoPage() {

    const getBreadcrumbs = [
        { label: "Dashboard", to: "/" },
        { label: "Vozes" }
    ]

    const getPageExtra = () => (
        <Button disabled>
            <AudioLines />
            Treinar Voz
        </Button>
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
