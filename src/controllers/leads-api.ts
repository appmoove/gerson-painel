import type { AxiosInstance, AxiosError } from 'axios';
import type { 
  CreateLeadRequest, 
  CreateLeadResponse, 
  UpdateLeadRequest, 
  UpdateLeadResponse, 
  LeadDetails, 
  LeadListParams
} from '../types/leads-api';
import type { ApiResponse } from '../types/api';
import { createApiInstance, handleAxiosResponse, handleAxiosError } from './base-api';
import { useAuth } from '@/stores/auth';

// ===========================
// Leads API Class
// ===========================

class LeadsApi {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = createApiInstance();
    }

    /**
     * Cria um novo lead
     */
    async createLead(leadData: CreateLeadRequest): Promise<ApiResponse<CreateLeadResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.post<CreateLeadResponse>(
            `/organizations/${organizationId}/leads/create`,
            leadData
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Lista todos os leads da organização
     */
    async listLeads(params?: LeadListParams): Promise<ApiResponse<LeadDetails[]>> {
        const authState = useAuth.getState();
        const organizationId = authState.user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        const queryParams = new URLSearchParams();
        
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }
        
        if (params?.filters) {
            const { filters } = params;
            if (filters.name) queryParams.append('name', filters.name);
            if (filters.email) queryParams.append('email', filters.email);
            if (filters.phone) queryParams.append('phone', filters.phone);
        }

        const queryString = queryParams.toString();
        const url = `/organizations/${organizationId}/leads/list${queryString ? `?${queryString}` : ''}`;

        return this.axiosInstance.get<LeadDetails[]>(url)
            .then(response => handleAxiosResponse(response))
            .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Busca um lead específico por ID
     */
    async getLead(leadId: string): Promise<ApiResponse<LeadDetails>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.get<LeadDetails>(
            `/organizations/${organizationId}/leads/${leadId}`
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Atualiza um lead existente
     */
    async updateLead(leadId: string, leadData: UpdateLeadRequest): Promise<ApiResponse<UpdateLeadResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.patch<UpdateLeadResponse>(
            `/organizations/${organizationId}/leads/${leadId}/update`,
            leadData
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }

    /**
     * Remove um lead
     */
    async deleteLead(leadId: string): Promise<ApiResponse<void>> {
        const organizationId = useAuth.getState().user?.organization_id;
        
        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.delete<void>(
            `/organizations/${organizationId}/leads/${leadId}/delete`
        )
        .then(response => handleAxiosResponse(response))
        .catch(error => handleAxiosError(error as AxiosError));
    }
}

// ===========================
// Instância e Exports
// ===========================

export const leadsApi = new LeadsApi();
