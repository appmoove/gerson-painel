import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Edit, Trash2, Calendar, RefreshCw } from "lucide-react"
import { LeadGroupLeadsList } from "./lead-group-leads-list"
import type { LeadGroupViewProps } from "../types"

// ===========================
// LeadGroupView Component
// ===========================

/**
 * Componente para visualização detalhada de um grupo de leads
 */
export function LeadGroupView({
    leadGroup,
    isLoading = false,
    onEdit,
    onDelete,
}: LeadGroupViewProps) {

    // Se estiver carregando, mostra skeleton
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Se não há grupo, mostra mensagem
    if (!leadGroup) {
        return (
            <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Grupo de leads não encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                    O grupo de leads solicitado não foi encontrado ou foi removido.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Layout em duas colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna esquerda - Informações do Grupo */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        {leadGroup.name}
                                    </CardTitle>
                                    <CardDescription>
                                        Detalhes do grupo de leads
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {leadGroup.leads?.length || 0} leads
                                </Badge>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            {/* Informações do Grupo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                            Informações Básicas
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Nome:</span>
                                                <span className="text-sm">{leadGroup.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                            Datas
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Criado em:</span>
                                                <span className="text-sm">
                                                    {new Date(leadGroup.created_at).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Atualizado em:</span>
                                                <span className="text-sm">
                                                    {new Date(leadGroup.updated_at).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ações */}
                            <div className="flex items-center gap-3 pt-4 border-t">
                                {onEdit && (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => onEdit(leadGroup.id)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar Grupo
                                    </Button>
                                )}
                                
                                {onDelete && (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => onDelete(leadGroup.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir Grupo
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna direita - Lista de Leads */}
                <div>
                    <LeadGroupLeadsList
                        leads={leadGroup.leads || []}
                        isLoading={isLoading}
                        title={`Leads em "${leadGroup.name}"`}
                    />
                </div>
            </div>
        </div>
    )
}
