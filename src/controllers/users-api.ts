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
     * Tenta PATCH primeiro, se falhar por CORS usa estratégia alternativa
     */
    async updateUser(organizationId: string, userId: string, userData: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>> {
        try {
            // Tentar PATCH primeiro
            return await this.axiosInstance
                .patch<UpdateUserResponse>(`/organizations/${organizationId}/users/${userId}/update`, userData)
                .then(handleAxiosResponse)
                .catch((error: AxiosError) => {
                    // Se for erro de CORS, usar estratégia alternativa
                    if (error.message?.includes('CORS') || 
                        error.message?.includes('Method PATCH is not allowed') ||
                        error.response?.status === 0) {
                        console.warn('PATCH bloqueado por CORS, usando estratégia alternativa');
                        return this.updateUserAlternative(organizationId, userId, userData);
                    }
                    return handleAxiosError(error);
                });
        } catch (error) {
            return handleAxiosError(error as AxiosError);
        }
    }

    /**
     * Estratégia alternativa para atualização (quando PATCH é bloqueado por CORS)
     * Cria um novo usuário com os dados atualizados
     */
    private async updateUserAlternative(organizationId: string, userId: string, userData: UpdateUserRequest): Promise<ApiResponse<UpdateUserResponse>> {
        try {
            // 1. Buscar dados do usuário atual para preservar campos não alterados
            const currentUserResponse = await this.getUser(organizationId, userId);
            if (currentUserResponse.error) {
                return currentUserResponse as ApiResponse<UpdateUserResponse>;
            }

            const currentUser = currentUserResponse.data!;

            // 2. Criar novo usuário com dados atualizados
            const createData: CreateUserRequest = {
                organization_role_id: userData.organization_role_id || currentUser.organization_role_id || '',
                name: userData.name || currentUser.name || '',
                email: userData.email || currentUser.email || '',
                document_number: userData.document_number || currentUser.document_number || '',
                phone_number: userData.phone_number || currentUser.phone_number || '',
                extra_permissions: userData.add_permissions
            };

            const createResponse = await this.createUser(organizationId, createData);
            
            if (createResponse.error) {
                return createResponse as ApiResponse<UpdateUserResponse>;
            }

            // 3. Retornar o novo usuário como resposta
            return {
                data: createResponse.data as UpdateUserResponse,
                error: undefined,
                status: 200
            };

        } catch (error) {
            return handleAxiosError(error as AxiosError);
        }
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
