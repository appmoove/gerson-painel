import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { Skeleton } from "../../../components/ui/skeleton";
import { Plus, Users } from "lucide-react";

import { useLeadGroups } from "../hooks";
import type { LeadGroupResponse } from "../../../types/lead-groups-api";

interface LeadGroupsSelectorProps {
  /** IDs dos grupos selecionados */
  selectedGroups: string[];
  /** Callback quando grupos são alterados */
  onGroupsChange: (groupIds: string[]) => void;
  /** Se está desabilitado */
  disabled?: boolean;
}

/**
 * Componente para seleção de grupos de leads
 */
export function LeadGroupsSelector({ 
  selectedGroups, 
  onGroupsChange, 
  disabled = false 
}: LeadGroupsSelectorProps) {
  const { groups, isLoading, error } = useLeadGroups();

  const handleGroupToggle = (groupId: string) => {
    if (disabled) return;
    
    const isSelected = selectedGroups.includes(groupId);
    
    if (isSelected) {
      // Remove o grupo da seleção
      onGroupsChange(selectedGroups.filter(id => id !== groupId));
    } else {
      // Adiciona o grupo à seleção
      onGroupsChange([...selectedGroups, groupId]);
    }
  };

  if (isLoading) {
    return <LeadGroupsSelectorSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Erro ao carregar grupos de leads</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="h-fit sticky top-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            Grupos de Leads
          </CardTitle>
          <p className="text-sm text-gray-500">
            Selecione os grupos para organizar o lead
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum grupo encontrado</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Crie grupos para organizar seus leads e facilitar o gerenciamento.
            </p>
            <Button variant="outline" size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Grupo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          Grupos de Leads
        </CardTitle>
        <p className="text-sm text-gray-500">
          Selecione os grupos para organizar o lead
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {groups.map((group) => (
            <GroupItem
              key={group.id}
              group={group}
              isSelected={selectedGroups.includes(group.id)}
              onToggle={() => handleGroupToggle(group.id)}
              disabled={disabled}
            />
          ))}
        </div>

        {selectedGroups.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Grupos selecionados ({selectedGroups.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedGroups.map((groupId) => {
                  const group = groups.find(g => g.id === groupId);
                  return group ? (
                    <Badge key={groupId} variant="secondary" className="text-xs px-2 py-1">
                      {group.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Item individual de grupo
 */
function GroupItem({ 
  group, 
  isSelected, 
  onToggle, 
  disabled 
}: {
  group: LeadGroupResponse;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <div className={`flex items-center space-x-3 p-3 border rounded-lg transition-all duration-200 ${
      isSelected 
        ? 'border-blue-200 bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <Checkbox
        id={group.id}
        checked={isSelected}
        onCheckedChange={onToggle}
        disabled={disabled}
        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
      />
      
      <div className="flex-1 min-w-0">
        <label 
          htmlFor={group.id}
          className={`text-sm font-medium cursor-pointer ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}
        >
          {group.name}
        </label>
        <p className={`text-xs ${
          isSelected ? 'text-blue-600' : 'text-gray-500'
        }`}>
          {group.leads_count} {group.leads_count === 1 ? 'lead' : 'leads'}
        </p>
      </div>
    </div>
  );
}

/**
 * Estado de carregamento
 */
function LeadGroupsSelectorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
