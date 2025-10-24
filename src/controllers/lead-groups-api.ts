import { AxiosError } from 'axios';

import { BaseApi } from './base-api';
import type { ApiResponse } from '../types/api';
import type {
    CreateLeadGroupRequest,
    CreateLeadGroupResponse,
    UpdateLeadGroupRequest,
    UpdateLeadGroupResponse,
    ListLeadGroupsResponse,
    GetLeadGroupResponse
} from '../types/lead-groups-api';

// ===========================
// Lead Groups API Class
// ===========================

class LeadGroupsApi extends BaseApi {

    /**
     * Cria um novo grupo de leads
     */
    createLeadGroup(leadGroupData: CreateLeadGroupRequest): Promise<ApiResponse<CreateLeadGroupResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.post<CreateLeadGroupResponse>(
            `/organizations/${organizationId}/lead-groups/create`, 
            leadGroupData
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Lista todos os grupos de leads da organização
     */
    listLeadGroups(): Promise<ApiResponse<ListLeadGroupsResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.get<ListLeadGroupsResponse>(
            `/organizations/${organizationId}/lead-groups/list`
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Busca um grupo de leads específico por ID
     */
    getLeadGroup(leadGroupId: string): Promise<ApiResponse<GetLeadGroupResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.get<GetLeadGroupResponse>(
            `/organizations/${organizationId}/lead-groups/${leadGroupId}`
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Atualiza um grupo de leads existente
     */
    updateLeadGroup(leadGroupId: string, leadGroupData: UpdateLeadGroupRequest): Promise<ApiResponse<UpdateLeadGroupResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.patch<UpdateLeadGroupResponse>(
            `/organizations/${organizationId}/lead-groups/${leadGroupId}/update`, 
            leadGroupData
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Exclui um grupo de leads
     */
    deleteLeadGroup(leadGroupId: string): Promise<ApiResponse<void>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.delete<void>(
            `/organizations/${organizationId}/lead-groups/${leadGroupId}/delete`
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }
}

// ===========================
// Instância e Exports
// ===========================

export const leadGroupsApi = new LeadGroupsApi();