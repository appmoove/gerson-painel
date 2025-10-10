// ===========================
// UsuariosPage Local Types
// ===========================

import type { UserDetails, UserViewMode } from "@/types/user-api";

/**
 * Estado da página de usuários
 */
export interface UsuariosPageState {
    mode: UserViewMode;
    userId?: string;
    users: UserDetails[];
    currentUser: UserDetails | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Props para componentes de usuário
 */
export interface UserListProps {
    users: UserDetails[];
    isLoading: boolean;
    onView: (user: UserDetails) => void;
    onEdit: (user: UserDetails) => void;
    onDelete?: (userId: string) => void;
}

export interface UserFormProps {
    user?: UserDetails;
    onSuccess: () => void;
    isLoading?: boolean;
    updateUsersList?: (result: { success: boolean; data: UserDetails; isUpdate: boolean }) => void;
}

export interface UserViewProps {
    user: UserDetails | null;
    isLoading: boolean;
    onEdit?: () => void;
}
