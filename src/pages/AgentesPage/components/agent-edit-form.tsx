import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Save, X, Bot, Edit } from "lucide-react"
import { useAgentForm } from "../hooks"
import type { CreateAgentResponse, AgentFormData } from "../types"
import {
    AgentErrorAlert,
    AgentNameField,
    AgentTypeField,
    AgentBehaviourField,
    AgentCharacteristicsField,
    AgentVoiceField
} from "./form"

// ===========================
// AgentEditForm Props
// ===========================

interface AgentEditFormProps {
    agent: CreateAgentResponse
    onSave: () => void
    onCancel: () => void
    isLoading?: boolean
}

// ===========================
// AgentEditForm Component
// ===========================

/**
 * Componente de formulário específico para edição de agente
 * Focado na experiência de edição com elementos visuais apropriados
 */
export function AgentEditForm({
    agent,
    onSave,
    onCancel,
    isLoading = false
}: AgentEditFormProps) {
    const {
        form,
        isSubmitting,
        submitError,
        onSubmit,
        clearError,
        voices
    } = useAgentForm(agent) // Com agente = modo edição

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (data: any) => {
        // Limpa erro anterior
        if (submitError) {
            clearError()
        }

        const result = await onSubmit(data as AgentFormData)
        if (result.success) {
            onSave()
        }
    }

    // Se estiver carregando, mostra skeletons
    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl">
                <Card>
                    <CardContent className="px-6">
                        <div className="space-y-6">
                            {/* Header com ícone de edição */}
                            <div className="flex items-center gap-2 text-primary">
                                <Edit className="h-5 w-5" />
                                <span className="text-lg font-semibold">Editar Agente</span>
                            </div>

                            <div className="grid gap-6">
                                {/* Linha 1: Nome e Tipo - Skeleton */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>

                                {/* Linha 2: Voz - Skeleton */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-12 w-full" />
                                </div>

                                {/* Linha 3: Comportamento - Skeleton */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-20 w-full" />
                                </div>

                                {/* Linha 4: Características - Skeleton */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            </div>

                            {/* Botões - Skeleton */}
                            <div className="flex justify-end gap-3 pt-6">
                                <Skeleton className="h-10 w-20" />
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl">
            <Card>
                <CardContent className="px-6">
                    <div className="space-y-6">
                        {/* Header com ícone de edição */}
                        <div className="flex items-center gap-2 text-primary">
                            <Edit className="h-5 w-5" />
                            <span className="text-lg font-semibold">Editar Agente</span>
                        </div>

                        {/* Informações do agente */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Bot className="h-4 w-4" />
                                <span>Editando: <strong className="text-foreground">{agent.name}</strong></span>
                            </div>
                        </div>

                        {/* Erro da API */}
                        {submitError && (
                            <AgentErrorAlert error={submitError} />
                        )}

                        {/* Formulário */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                {/* Ícone discreto do bot */}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Bot className="h-4 w-4" />
                                    <span className="text-sm">Configuração do Agente</span>
                                </div>

                                <div className="grid gap-6">
                                    {/* Linha 1: Nome e Tipo - Responsivo */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <AgentNameField />
                                        <AgentTypeField />
                                    </div>

                                    {/* Linha 2: Voz */}
                                    <AgentVoiceField voices={voices} />

                                    {/* Linha 3: Comportamento */}
                                    <AgentBehaviourField />

                                    {/* Linha 4: Características */}
                                    <AgentCharacteristicsField />
                                </div>

                                <Separator />

                                {/* Ações */}
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCancel}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto cursor-pointer"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            "Salvando..."
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Salvar Alterações
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
