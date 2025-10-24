import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Mail, Phone, Calendar } from "lucide-react"
import type { LeadInfo } from "@/types/lead-groups-api"

// ===========================
// LeadGroupLeadsList Component
// ===========================

interface LeadGroupLeadsListProps {
    /** Lista de leads do grupo */
    leads: LeadInfo[]
    /** Estado de carregamento */
    isLoading?: boolean
    /** Título do card */
    title?: string
}

/**
 * Componente para listar os leads de um grupo específico
 * Exibe informações básicas de cada lead em formato de lista
 */
export function LeadGroupLeadsList({
    leads,
    isLoading = false,
    title = "Leads do Grupo"
}: LeadGroupLeadsListProps) {

    // Se estiver carregando, mostra skeletons
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {title}
                    </CardTitle>
                    <CardDescription>
                        Carregando leads do grupo...
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    // Se não há leads, mostra mensagem
    if (leads.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {title}
                    </CardTitle>
                    <CardDescription>
                        Este grupo ainda não possui leads
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                            Nenhum lead foi adicionado a este grupo ainda.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {title}
                </CardTitle>
                <CardDescription>
                    {leads.length} {leads.length === 1 ? 'lead' : 'leads'} neste grupo
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {leads.map((lead) => (
                    <div key={lead.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        {/* Avatar/Inicial */}
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                    {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                        </div>

                        {/* Informações do Lead */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm truncate">
                                    {lead.name || 'Nome não informado'}
                                </h4>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {lead.email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">{lead.email}</span>
                                    </div>
                                )}
                                
                                {lead.phone && (
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        <span>{lead.phone}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
