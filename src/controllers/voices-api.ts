import type { AxiosError, AxiosInstance } from "axios";
import { createApiInstance, handleAxiosError, handleAxiosResponse } from "./base-api";
import type { ApiResponse, ListVoicesResponse } from "@/types";
import { useAuth } from "@/stores/auth";

class VoicesApi {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = createApiInstance();
    }

    /**
     * Lista todas as vozes da organização
     * @returns Lista de vozes da organização
     */
    listOrganizationVoices(): Promise<ApiResponse<ListVoicesResponse>> {
        const organizationId = useAuth.getState().user?.organization_id;

        if (!organizationId) {
            throw new Error('Organization ID not found');
        }

        return this.axiosInstance.get<ListVoicesResponse>(`/organizations/${organizationId}/voices/list`)
            .then(response => handleAxiosResponse(response))
            .catch(error => handleAxiosError(error as AxiosError));
    }
}

export const voicesApi = new VoicesApi();
