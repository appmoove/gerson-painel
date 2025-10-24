import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Edit, Trash2, Eye } from "lucide-react"
import type { LeadGroupsListProps } from "../types"

// ===========================
// LeadGroupsList Component
// ===========================

/**
 * Componente de lista de grupos de leads em formato de cards
 * Segue o padrão do projeto com cards responsivos
 */
export function LeadGroupsList({
    leadGroups,
    isLoading,
    onView,
    onEdit,
    onDelete,
}: LeadGroupsListProps) {

    // Se estiver carregando, mostra skeletons
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="h-32">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // Se não há grupos, mostra mensagem
    if (leadGroups.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Nenhum grupo de leads encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                    Crie seu primeiro grupo de leads para começar a organizar seus contatos.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadGroups.map((leadGroup) => (
                <Card key={leadGroup.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold truncate">
                                {leadGroup.name}
                            </CardTitle>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {leadGroup.leads_count}
                            </Badge>
                        </div>
                        <CardDescription>
                            Grupo de leads criado em {new Date(leadGroup.created_at).toLocaleDateString('pt-BR')}
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                                Atualizado em {new Date(leadGroup.updated_at).toLocaleDateString('pt-BR')}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onView(leadGroup.id)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(leadGroup.id)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                
                                {onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(leadGroup.id)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
