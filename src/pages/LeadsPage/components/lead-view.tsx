import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Users
} from "lucide-react";

import type { LeadViewProps } from "../types";

/**
 * Componente para visualização detalhada de um lead
 */
export function LeadView({ lead, onEdit, onBack }: LeadViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return null;
    // Formata telefone brasileiro
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Editar Lead
        </Button>
      </div>

      {/* Informações principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Lead
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Nome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-lg font-semibold">
                {lead.name || 'Nome não informado'}
              </p>
            </div>
          </div>

          {/* Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lead.email && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="text-sm">{lead.email}</p>
              </div>
            )}
            
            {lead.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </label>
                <p className="text-sm">{formatPhone(lead.phone)}</p>
              </div>
            )}
          </div>

          {/* Grupos */}
          {lead.groups && lead.groups.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                Grupos
              </label>
              <div className="flex flex-wrap gap-2">
                {lead.groups.map((group) => (
                  <Badge key={group.id} variant="secondary">
                    {group.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Criado em
              </label>
              <p className="text-sm">{formatDate(lead.created_at)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Atualizado em
              </label>
              <p className="text-sm">{formatDate(lead.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados adicionais */}
      {lead.lead_data && Object.keys(lead.lead_data).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Adicionais</CardTitle>
          </CardHeader>
          
          <CardContent>
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(lead.lead_data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Estado de carregamento para visualização
 */
export function LeadViewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
