import { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';

import { createApiInstance, handleAxiosResponse, handleAxiosError } from './base-api';
import type { ApiResponse } from '../types/api';
import type {
    CreateUserRequest,
    CreateUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    ListUsersResponse,
    GetUserResponse
}
from '../types/user-api';

import { useAuth } from "@/stores/auth";


// ===========================
// Users API Class
// ===========================

class UsersApi {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = createApiInstance();
    }

    /**
     * Cria um novo usuário
     */
    createUser(userData: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;

        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance
            .post<CreateUserResponse>(`/organizations/${organizationId}/users/create`, userData)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }

    /**
     * Lista todos os usuários da organização
     */
    listUsers(params?: { page?: number; limit?: number }): Promise<ApiResponse<ListUsersResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;

        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const url = `/organizations/${organizationId}/users/list${queryString ? `?${queryString}` : ''}`;

        return this.axiosInstance
            .get<ListUsersResponse>(url)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }

    /**
     * Busca um usuário específico
     */
    getUser(userId: string): Promise<ApiResponse<GetUserResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;

        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance
            .get<GetUserResponse>(`/organizations/${organizationId}/users/${userId}`)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }

    /**
     * Atualiza um usuário existente
     * Tenta PATCH primeiro, se falhar por CORS usa estratégia alternativa
     */
    async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;

        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return await this.axiosInstance
            .patch<UpdateUserResponse>(`/organizations/${organizationId}/users/${userId}/update`, userData)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }

    /**
     * Remove um usuário (soft delete)
     */
    deleteUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
        const organizationId = useAuth.getState().user?.organization_id;

        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance
            .delete(`/organizations/${organizationId}/users/${userId}/delete`)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }
}

// ===========================
// Instância e Exports
// ===========================

export const usersApi = new UsersApi();
