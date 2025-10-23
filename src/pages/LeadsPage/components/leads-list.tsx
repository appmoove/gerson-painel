import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Users
} from "lucide-react";

import type { LeadsListProps } from "../types";

/**
 * Componente de lista de leads
 * Exibe cards com informações dos leads e ações disponíveis
 */
export function LeadsList({ 
  leads, 
  isLoading, 
  onView, 
  onEdit, 
  onDelete 
}: LeadsListProps) {
  if (isLoading) {
    return <LeadsListSkeleton />;
  }

  if (leads.length === 0) {
    return <EmptyLeadsState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onView={() => onView(lead)}
          onEdit={() => onEdit(lead.id)}
          onDelete={() => onDelete(lead.id)}
        />
      ))}
    </div>
  );
}

/**
 * Card individual de lead
 */
function LeadCard({ 
  lead, 
  onView, 
  onEdit, 
  onDelete 
}: {
  lead: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">
              {lead.name || 'Nome não informado'}
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
              title="Visualizar"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              title="Excluir"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Email */}
        {lead.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}

        {/* Telefone */}
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{formatPhone(lead.phone)}</span>
          </div>
        )}

        {/* Grupos */}
        {lead.groups && lead.groups.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {lead.groups.map((group: any) => (
                <Badge key={group.id} variant="secondary" className="text-xs">
                  {group.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Data de criação */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Criado em {formatDate(lead.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Estado de carregamento da lista
 */
function LeadsListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Estado vazio quando não há leads
 */
function EmptyLeadsState() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Comece criando seu primeiro lead para gerenciar seus contatos.
        </p>
      </CardContent>
    </Card>
  );
}
