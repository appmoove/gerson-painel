import { BaseApi } from '@/controllers/base-api';

import type { AxiosError } from 'axios';
import type {
    LoginRequest,
    LoginResponse,
} from '../types/auth';
import type { ApiResponse } from '../types/api';

import { AUTH_ENDPOINTS } from '@/constants/auth';

// ===========================
// Auth API Class
// ===========================

class AuthApi extends BaseApi {

    /**
     * Realiza login do usuário
     */
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        try {
            const response = await this.axiosInstance.post<LoginResponse>(
                AUTH_ENDPOINTS.LOGIN,
                credentials
            );
            return this.handleAxiosResponse(response);
        } catch (error) {
            return this.handleAxiosError(error as AxiosError);
        }
    }
}

// ===========================
// Instância e Exports
// ===========================

export const authApi = new AuthApi();
