import { AxiosError } from 'axios';

import { BaseApi } from './base-api';
import type { ApiResponse } from '../types/api';
import type {
    CreateAgentRequest,
    CreateAgentResponse,
    UpdateAgentRequest,
    UpdateAgentResponse,
    ListAgentsResponse,
    GetAgentResponse,
    ListVoicesResponse
} from '../types/agent-api';

// ===========================
// Agents API Class
// ===========================

class AgentsApi extends BaseApi {

    /**
     * Cria um novo agente
     */
    createAgent(agentData: CreateAgentRequest): Promise<ApiResponse<CreateAgentResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.post<CreateAgentResponse>(
            `/organizations/${organizationId}/agents/create`, 
            agentData
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Lista todos os agentes da organização
     */
    listAgents(): Promise<ApiResponse<ListAgentsResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.get<ListAgentsResponse>(
            `/organizations/${organizationId}/agents/list`
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Busca um agente específico por ID
     */
    getAgent(agentId: string): Promise<ApiResponse<GetAgentResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.get<GetAgentResponse>(
            `/organizations/${organizationId}/agents/${agentId}`
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Atualiza um agente existente
     */
    updateAgent(agentId: string, agentData: UpdateAgentRequest): Promise<ApiResponse<UpdateAgentResponse>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.patch<UpdateAgentResponse>(
            `/organizations/${organizationId}/agents/${agentId}/update`, 
            agentData
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }

    /**
     * Exclui um agente
     */
    deleteAgent(agentId: string): Promise<ApiResponse<void>> {
        const organizationId = this.getOrganizationId();
        
        return this.axiosInstance.delete<void>(
            `/organizations/${organizationId}/agents/${agentId}/delete`
        )
            .then(response => this.handleAxiosResponse(response))
            .catch(error => this.handleAxiosError(error as AxiosError));
    }
}

// ===========================
// Instância e Exports
// ===========================

export const agentsApi = new AgentsApi();
