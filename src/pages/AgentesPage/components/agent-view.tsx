import { MessageSquare, Settings, User, Bot, Volume2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/custom/audio-player"
import type { AgentViewProps } from "../types"
import { cn } from "@/lib/utils"
import { AGENT_TYPE_LABELS } from "@/constants/agent"
import { useAgentVoice } from "../hooks"

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
// AgentView Component
// ===========================

/**
 * Componente de visualização detalhada de um agente
 * Mostra todas as informações organizadas em cards
 */
export function AgentView({ agent, isLoading = false }: AgentViewProps) {
    // Hook para buscar dados da voz do agente
    const { voice: agentVoice, isLoading: voiceLoading } = useAgentVoice(agent?.voice_id)

    // Se estiver carregando ou não tiver agente, mostra skeletons
    if (isLoading || !agent) {
        return (
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Card: Informações Básicas - Skeleton */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                <CardTitle>Informações Básicas</CardTitle>
                            </div>
                            <CardDescription>
                                Dados fundamentais do agente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-12 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Separator />
                            <div>
                                <Skeleton className="h-4 w-12 mb-2" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Configurações - Skeleton */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                <CardTitle>Configurações</CardTitle>
                            </div>
                            <CardDescription>
                                Configurações técnicas do agente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-6 w-full" />
                            </div>
                            <Separator />
                            <div>
                                <Skeleton className="h-4 w-8 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Descrição - Skeleton */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                <CardTitle>Descrição</CardTitle>
                            </div>
                            <CardDescription>
                                Descrição do agente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Objetivo - Skeleton */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                <CardTitle>Objetivo</CardTitle>
                            </div>
                            <CardDescription>
                                Propósito e função principal do agente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Personalidade - Skeleton */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                <CardTitle>Personalidade</CardTitle>
                            </div>
                            <CardDescription>
                                Características comportamentais e tom de voz
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Card: Informações Básicas */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <CardTitle>Informações Básicas</CardTitle>
                        </div>
                        <CardDescription>
                            Dados fundamentais do agente
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Nome
                            </label>
                            <p className="text-sm mt-1">{agent.name}</p>
                        </div>

                        <Separator />

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Tipo
                            </label>
                            <div className="mt-1">
                                {getTypeLabel(agent.type)}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Card: Configurações */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            <CardTitle>Configurações</CardTitle>
                        </div>
                        <CardDescription>
                            Configurações técnicas do agente
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Voz Selecionada
                            </label>
                            <div className="mt-2 space-y-3">
                                {voiceLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                ) : agentVoice ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Volume2 className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium">{agentVoice.name}</span>
                                            </div>
                                            <Badge
                                                variant={agentVoice.gender === 'MALE' ? 'default' : 'secondary'}
                                                className={`text-xs px-2 py-0.5 ${agentVoice.gender === 'FEMALE'
                                                    ? 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
                                                    : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                    }`}
                                            >
                                                {agentVoice.gender === 'MALE' ? 'Masculino' : 'Feminino'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {agentVoice.description}
                                        </p>
                                        <div className="pt-2">
                                            <AudioPlayer voice={agentVoice} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Voz ID: {agent.voice_id}</span>
                                        <p className="text-xs text-muted-foreground">
                                            Voz não encontrada ou indisponível
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card: Comportamento */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <CardTitle>Comportamento</CardTitle>
                        </div>
                        <CardDescription>
                            Como o agente deve se comportar e se comunicar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {agent.behaviour}
                        </p>
                    </CardContent>
                </Card>

                {/* Card: Características */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <CardTitle>Características</CardTitle>
                        </div>
                        <CardDescription>
                            Características específicas e habilidades do agente
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {agent.characteristics}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
