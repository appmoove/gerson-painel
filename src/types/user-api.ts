// ===========================
// User API Types
// ===========================

/**
 * Dados básicos de um usuário
 */
export interface UserDetails {
    id: string;
    organization_id: string;
    organization_role_id: string | null;
    name: string | null;
    email: string | null;
    document_number: string | null;
    phone_number: string | null;
    active: boolean | null;
    image_url?: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    deleted_at?: Date | null;
    extra_permissions?: string[];
}

/**
 * Request para criar um usuário
 */
export interface CreateUserRequest {
    organization_role_id: string;
    name: string;
    email: string;
    document_number: string;
    phone_number: string;
    extra_permissions?: string[];
}

/**
 * Response da criação de usuário
 */
export interface CreateUserResponse extends UserDetails {}

/**
 * Request para atualizar um usuário
 */
export interface UpdateUserRequest {
    organization_role_id?: string;
    name?: string;
    email?: string;
    document_number?: string;
    phone_number?: string;
    active?: boolean;
    image_url?: string;
    extra_permissions?: string[];
}

/**
 * Response da atualização de usuário
 */
export interface UpdateUserResponse extends UserDetails {}

/**
 * Response da listagem de usuários
 */
export interface ListUsersResponse extends Array<UserDetails> {}

/**
 * Response da busca de usuário específico
 */
export interface GetUserResponse extends UserDetails {}

/**
 * Dados do formulário de usuário
 */
export interface UserFormData {
    organization_role_id: string;
    name: string;
    email: string;
    document_number: string;
    phone_number: string;
    image_url?: string;
    extra_permissions?: string[];
}

/**
 * Props para componentes de usuário
 */
export interface UserListProps {
    users: UserDetails[];
    isLoading: boolean;
    onView: (user: UserDetails) => void;
    onEdit: (userId: string) => void;
    onDelete?: (userId: string) => void;
}

export interface UserFormProps {
    user?: UserDetails;
    onSave: (data: UserFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export interface UserViewProps {
    user: UserDetails | null;
    isLoading: boolean;
    onEdit?: () => void;
}

/**
 * Estado da página de usuários
 */
export interface UsersPageState {
    mode: UserViewMode;
    userId?: string;
    users: UserDetails[];
    currentUser: UserDetails | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Modos de visualização da página de usuários
 */
export type UserViewMode = 'list' | 'create' | 'view' | 'edit';
