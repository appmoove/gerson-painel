import type { AxiosInstance, AxiosError } from 'axios';
import type { 
  CreateLeadGroupRequest, 
  CreateLeadGroupResponse, 
  UpdateLeadGroupRequest, 
  UpdateLeadGroupResponse, 
  LeadGroupResponse, 
  LeadGroupListParams
} from '../types/lead-groups-api';
import type { ApiResponse } from '../types/api';
import { createApiInstance, handleAxiosResponse, handleAxiosError } from './base-api';
import { useAuth } from '@/stores/auth';

// ===========================
// Lead Groups API Class
// ===========================

class LeadGroupsApi {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = createApiInstance();
    }

    /**
     * Cria um novo grupo de leads
     */
    async createLeadGroup(groupData: CreateLeadGroupRequest): Promise<ApiResponse<CreateLeadGroupResponse>> {
        const authState = useAuth.getState();
        const organizationId = authState.user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.post<CreateLeadGroupResponse>(
            `/organizations/${organizationId}/lead-groups/create`,
            groupData
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Lista todos os grupos de leads da organização
     */
    async listLeadGroups(params?: LeadGroupListParams): Promise<ApiResponse<LeadGroupResponse[]>> {
        const authState = useAuth.getState();
        const organizationId = authState.user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        const queryParams = new URLSearchParams();
        
        if (params?.filters) {
            const { filters } = params;
            if (filters.name) queryParams.append('name', filters.name);
        }

        const queryString = queryParams.toString();
        const url = `/organizations/${organizationId}/lead-groups/list${queryString ? `?${queryString}` : ''}`;

        return this.axiosInstance.get<LeadGroupResponse[]>(url)
            .then(response => handleAxiosResponse(response))
            .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Busca um grupo específico por ID
     */
    async getLeadGroup(groupId: string): Promise<ApiResponse<LeadGroupResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.get<LeadGroupResponse>(
            `/organizations/${organizationId}/lead-groups/${groupId}`
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Atualiza um grupo existente
     */
    async updateLeadGroup(groupId: string, groupData: UpdateLeadGroupRequest): Promise<ApiResponse<UpdateLeadGroupResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.patch<UpdateLeadGroupResponse>(
            `/organizations/${organizationId}/lead-groups/${groupId}`,
            groupData
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Remove um grupo
     */
    async deleteLeadGroup(groupId: string): Promise<ApiResponse<void>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.delete<void>(
            `/organizations/${organizationId}/lead-groups/${groupId}`
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Adiciona um lead a um grupo
     */
    async addLeadToGroup(groupId: string, leadId: string): Promise<ApiResponse<any>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.post<any>(
            `/organizations/${organizationId}/lead-groups/${groupId}/leads/add`,
            { lead_ids: [leadId] }
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }
}

// ===========================
// Instância e Exports
// ===========================

export const leadGroupsApi = new LeadGroupsApi();
