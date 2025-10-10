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
} from '../types/user-api';

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
    createUser(organizationId: string, userData: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
        return this.axiosInstance
            .post<CreateUserResponse>(`/organizations/${organizationId}/users/create`, userData)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }

    /**
     * Lista todos os usuários da organização
     */
    listUsers(organizationId: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<ListUsersResponse>> {
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
    getUser(organizationId: string, userId: string): Promise<ApiResponse<GetUserResponse>> {
        return this.axiosInstance
            .get<GetUserResponse>(`/organizations/${organizationId}/users/${userId}`)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }

    /**
     * Atualiza um usuário existente
     */
    updateUser(organizationId: string, userId: string, userData: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>> {
        return this.axiosInstance
            .patch<UpdateUserResponse>(`/organizations/${organizationId}/users/${userId}`, userData)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }

    /**
     * Remove um usuário (soft delete)
     */
    deleteUser(organizationId: string, userId: string): Promise<ApiResponse<{ success: boolean }>> {
        return this.axiosInstance
            .delete(`/organizations/${organizationId}/users/${userId}`)
            .then(handleAxiosResponse)
            .catch((error: AxiosError) => handleAxiosError(error));
    }
}

// ===========================
// Instância e Exports
// ===========================

export const usersApi = new UsersApi();
