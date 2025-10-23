import { BaseApi } from './base-api';

import type { ApiResponse } from '../types/api';
import type {
    CreateUserRequest,
    CreateUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    ListUsersResponse,
    GetUserResponse
} from '../types/user-api';
import type { AxiosError } from 'axios';

// ===========================
// Users API Class
// ===========================

class UsersApi extends BaseApi {

    /**
     * Cria um novo usuário
     */
    createUser(userData: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
        const organizationId = this.getOrganizationId();

        return this.axiosInstance
            .post<CreateUserResponse>(`/organizations/${organizationId}/users/create`, userData)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }

    /**
     * Lista todos os usuários da organização
     */
    listUsers(params?: { page?: number; limit?: number }): Promise<ApiResponse<ListUsersResponse>> {
        const organizationId = this.getOrganizationId();

        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const url = `/organizations/${organizationId}/users/list${queryString ? `?${queryString}` : ''}`;

        return this.axiosInstance
            .get<ListUsersResponse>(url)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }

    /**
     * Busca um usuário específico
     */
    getUser(userId: string): Promise<ApiResponse<GetUserResponse>> {
        const organizationId = this.getOrganizationId();

        return this.axiosInstance
            .get<GetUserResponse>(`/organizations/${organizationId}/users/${userId}`)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }

    /**
     * Atualiza um usuário existente
     * Tenta PATCH primeiro, se falhar por CORS usa estratégia alternativa
     */
    async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>> {
        const organizationId = this.getOrganizationId();

        return await this.axiosInstance
            .patch<UpdateUserResponse>(`/organizations/${organizationId}/users/${userId}/update`, userData)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }

    /**
     * Remove um usuário (soft delete)
     */
    deleteUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
        const organizationId = this.getOrganizationId();

        return this.axiosInstance
            .delete(`/organizations/${organizationId}/users/${userId}/delete`)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }
}

// ===========================
// Instância e Exports
// ===========================

export const usersApi = new UsersApi();
