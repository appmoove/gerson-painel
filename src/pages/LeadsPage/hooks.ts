/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { leadsApi } from "../../controllers/leads-api";
import { leadGroupsApi } from "../../controllers/lead-groups-api";
import type { ApiResponse } from "../../types/api";
import type { LeadDetails, LeadFilters, LeadListParams } from "../../types/leads-api";
import type { LeadGroupResponse, LeadGroupListParams } from "../../types/lead-groups-api";

import { type LeadFormData } from "./validation";
import type {
  LeadViewMode
} from "./types";

// ===========================
// Leads Navigation Hook
// ===========================

/**
 * Hook para gerenciar navegação entre modos da página de leads
 */
export function useLeadsNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { leadId } = useParams<{ leadId: string }>();

  const [mode, setMode] = useState<LeadViewMode>('list');

  // Determina o modo baseado na URL
  useEffect(() => {
    const path = location.pathname;

    if (path.includes('/leads/create')) {
      setMode('create');
    } else if (path.includes('/leads/') && leadId && !path.includes('/edit')) {
      setMode('view');
    } else if (path.includes('/leads/') && leadId && path.includes('/edit')) {
      setMode('edit');
    } else if (path.includes('/leads')) {
      setMode('list');
    }
  }, [location.pathname, leadId]);

  const goToList = useCallback(() => {
    navigate('/leads');
    setMode('list');
  }, [navigate]);

  const goToCreate = useCallback(() => {
    navigate('/leads/create');
    setMode('create');
  }, [navigate]);

  const goToView = useCallback((id: string) => {
    navigate(`/leads/${id}`);
    setMode('view');
  }, [navigate]);

  const goToEdit = useCallback((id: string) => {
    navigate(`/leads/${id}/edit`);
    setMode('edit');
  }, [navigate]);

  return {
    mode,
    leadId,
    goToList,
    goToCreate,
    goToView,
    goToEdit,
  };
}

// ===========================
// Leads Data Hook
// ===========================

/**
 * Hook para gerenciar dados e operações de leads
 */
export function useLeads() {
  const [leads, setLeads] = useState<LeadDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({});

  const refreshLeads = useCallback(async (params?: LeadListParams) => {
    setIsLoading(true);
    setError(null);

    try {

      const response: ApiResponse<LeadDetails[]> = await leadsApi.listLeads({
        ...params,
        filters: { ...filters, ...params?.filters }
      });


      if (response.status >= 200 && response.status < 300) {
        const leadsData = response.data || [];

        setLeads(leadsData);
      } else {
        setError('Erro ao carregar leads');
      }
      // TODO: Melhorar tipagem de erros
    } catch (err) {
      setError('Erro ao carregar leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const deleteLead = useCallback(async (leadId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: ApiResponse<void> = await leadsApi.deleteLead(leadId);

      if (response.status >= 200 && response.status < 300) {
        toast.success('Lead removido com sucesso');
        await refreshLeads();
      } else {
        toast.error('Erro ao remover lead');
      }
    } catch (err) {
      toast.error('Erro ao remover lead');
      console.error('Error deleting lead:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshLeads]);

  const updateFilters = useCallback((newFilters: LeadFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    leads,
    isLoading,
    error,
    filters,
    refreshLeads,
    deleteLead,
    updateFilters,
  };
}

// ===========================
// Lead Form Hook
// ===========================

/**
 * Hook para gerenciar formulário de lead
 */
export function useLeadForm(lead?: LeadDetails) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LeadFormData>({
    defaultValues: {
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      groups: lead?.groups?.map(g => g.id) || [],
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {

      // TODO: Melhorar tipagem
      let response: ApiResponse<any>;
      let leadId: string;

      if (lead) {
        // Atualizar lead existente
        response = await leadsApi.updateLead(lead.id, {
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
        leadId = lead.id;
      } else {
        // Criar novo lead
        response = await leadsApi.createLead({
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
        leadId = response.data?.id;
      }

      if (response.status >= 200 && response.status < 300) {

        // Processar grupos se houver grupos selecionados
        if (data.groups && data.groups.length > 0 && leadId) {

          // Para cada grupo selecionado, adicionar o lead
          for (const groupId of data.groups) {
            try {
              await leadGroupsApi.addLeadToGroup(groupId, leadId);
              // TODO: Melhorar tipagem
            } catch (groupError) {
              // Não falha a operação principal, apenas loga o erro
            }
          }
        }

        toast.success(lead ? 'Lead atualizado com sucesso' : 'Lead criado com sucesso');
        return true;
      } else {
        setApiError('Erro ao salvar lead');
        return false;
      }
    } catch (err) {
      setApiError('Erro ao salvar lead');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => setApiError(null);

  return {
    form,
    isSubmitting,
    apiError,
    onSubmit,
    clearError,
  };
}

// ===========================
// Lead Detail Hook
// ===========================

/**
 * Hook para carregar detalhes de um lead específico
 */
export function useLeadDetail(leadId?: string) {
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLead = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: ApiResponse<LeadDetails> = await leadsApi.getLead(id);

      if (response.status >= 200 && response.status < 300) {
        setLead(response.data || null);
      } else {
        setError('Erro ao carregar lead');
      }
    } catch (err) {
      setError('Erro ao carregar lead');
      console.error('Error loading lead:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (leadId) {
      loadLead(leadId);
    }
  }, [leadId, loadLead]);

  return {
    lead,
    isLoading,
    error,
    loadLead,
  };
}

// ===========================
// Lead Groups Hook
// ===========================

/**
 * Hook para gerenciar grupos de leads
 */
export function useLeadGroups() {
  const [groups, setGroups] = useState<LeadGroupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGroups = useCallback(async (params?: LeadGroupListParams) => {
    setIsLoading(true);
    setError(null);

    try {

      const response: ApiResponse<LeadGroupResponse[]> = await leadGroupsApi.listLeadGroups(params);

      console.log('📡 Resposta da API:', response);
      console.log('📊 Status:', response.status);
      console.log('📋 Grupos recebidos:', response.data);

      if (response.status >= 200 && response.status < 300) {
        const groupsData = response.data || [];

        setGroups(groupsData);
      } else {
        setError('Erro ao carregar grupos de leads');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar grupos de leads:', err);
      setError('Erro ao carregar grupos de leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (name: string) => {
    setIsLoading(true);
    setError(null);

    try {

      const response: ApiResponse<LeadGroupResponse> = await leadGroupsApi.createLeadGroup({ name });

      if (response.status >= 200 && response.status < 300) {
        toast.success('Grupo criado com sucesso');
        await refreshGroups();
        return response.data;
      } else {
        toast.error('Erro ao criar grupo');
        return null;
      }
    } catch (err) {
      toast.error('Erro ao criar grupo');
      console.error('Error creating group:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refreshGroups]);

  // Carregar grupos na montagem
  useEffect(() => {
    refreshGroups();
  }, [refreshGroups]);

  return {
    groups,
    isLoading,
    error,
    refreshGroups,
    createGroup,
  };
}
