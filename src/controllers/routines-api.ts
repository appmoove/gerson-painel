import { BaseApi } from './base-api'

import type { ApiResponse } from '@/types/api'
import type {
    CreateRoutineRequest,
    CreateRoutineResponse,
    UpdateRoutineRequest,
    UpdateRoutineResponse,
    ListRoutinesResponse,
    GetRoutineResponse
} from '@/types/routine-api'
import type { AxiosError } from 'axios'

// ===========================
// Routines API Class
// ===========================

class RoutinesApi extends BaseApi {

    /**
     * Criar uma nova rotina
     */
    createRoutine(data: CreateRoutineRequest): Promise<ApiResponse<CreateRoutineResponse>> {
        return this.axiosInstance.post<CreateRoutineResponse>('/routine/create', data)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }

    /**
     * Listar todas as rotinas da empresa do usuário logado
     * Usa o company_id do token JWT automaticamente
     */
    listRoutines(): Promise<ApiResponse<ListRoutinesResponse>> {
        const organizationId = this.getOrganizationId();

        return this.axiosInstance.get<ListRoutinesResponse>(`/organizations/${organizationId}/routines/list`)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }

    /**
     * Buscar rotina por ID
     */
    getRoutine(routineId: string): Promise<ApiResponse<GetRoutineResponse>> {
        return this.axiosInstance.get<GetRoutineResponse>(`/routine/${routineId}`)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }

    /**
     * Atualizar rotina existente
     * Nota: Este endpoint não existe na documentação, mas seguindo o padrão
     * Provavelmente será POST /routine/:routine_id/update
     */
    updateRoutine(routineId: string, data: UpdateRoutineRequest): Promise<ApiResponse<UpdateRoutineResponse>> {
        return this.axiosInstance.put<UpdateRoutineResponse>(`/routine/${routineId}`, data)
            .then(this.handleAxiosResponse)
            .catch(error => this.handleAxiosError(error as AxiosError))
    }
}

// ===========================
// Instância e Exports
// ===========================

export const routinesApi = new RoutinesApi()
