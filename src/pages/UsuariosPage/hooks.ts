import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import { usersApi } from "@/controllers/users-api";
import { useAuth } from "@/stores/auth";
import type { ApiResponse } from "@/types/api";
import type { 
    UserDetails, 
    CreateUserRequest, 
    UpdateUserRequest,
    UserFormData,
    UserViewMode 
} from "@/types/user-api";

// ===========================
// Validation Schemas
// ===========================

const userSchema = z.object({
    organization_role_id: z.string().uuid("ID do cargo deve ser um UUID válido"),
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    document_number: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CNPJ deve ter no máximo 14 dígitos"),
    phone_number: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    image_url: z.string().optional(),
    extra_permissions: z.array(z.string()).optional()
});

// ===========================
// User Form Hook
// ===========================

export function useUserForm(user?: UserDetails) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user: authUser } = useAuth();
    
    const organizationId = authUser?.organization_id;

    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            organization_role_id: user?.organization_role_id || "",
            name: user?.name || "",
            email: user?.email || "",
            document_number: user?.document_number || "",
            phone_number: user?.phone_number || "",
            image_url: user?.image_url || "",
            extra_permissions: []
        }
    });

    const onSubmit = useCallback(async (data: UserFormData) => {
        if (!organizationId) {
            toast.error("ID da organização não encontrado");
            return;
        }

        setIsSubmitting(true);
        try {
            let response: ApiResponse<UserDetails>;

            if (user) {
                // Atualizar usuário existente - enviar apenas campos alterados
                const updateData: UpdateUserRequest = {};
                
                // Comparar e incluir apenas campos que foram alterados
                if (data.organization_role_id !== user.organization_role_id) {
                    updateData.organization_role_id = data.organization_role_id;
                }
                
                if (data.name !== user.name) {
                    updateData.name = data.name;
                }
                
                if (data.email !== user.email) {
                    updateData.email = data.email;
                }
                
                if (data.document_number !== user.document_number) {
                    updateData.document_number = data.document_number;
                }
                
                if (data.phone_number !== user.phone_number) {
                    updateData.phone_number = data.phone_number;
                }
                
                if (data.image_url !== user.image_url) {
                    updateData.image_url = data.image_url;
                }
                
                // Para permissões, comparar arrays
                const currentPermissions = user.extra_permissions || [];
                const newPermissions = data.extra_permissions || [];
                
                // Verificar se há diferenças nas permissões
                const permissionsChanged = 
                    currentPermissions.length !== newPermissions.length ||
                    !currentPermissions.every(perm => newPermissions.includes(perm));
                
                if (permissionsChanged) {
                    // Calcular permissões a serem adicionadas e removidas
                    const addPermissions = newPermissions.filter(perm => !currentPermissions.includes(perm));
                    const removePermissions = currentPermissions.filter(perm => !newPermissions.includes(perm));
                    
                    if (addPermissions.length > 0) {
                        updateData.add_permissions = addPermissions;
                    }
                    
                    if (removePermissions.length > 0) {
                        updateData.remove_permissions = removePermissions;
                    }
                }

                response = await usersApi.updateUser(organizationId, user.id, updateData);
            } else {
                // Criar novo usuário
                const createData: CreateUserRequest = {
                    organization_role_id: data.organization_role_id,
                    name: data.name,
                    email: data.email,
                    document_number: data.document_number,
                    phone_number: data.phone_number,
                    extra_permissions: data.extra_permissions && data.extra_permissions.length > 0 ? data.extra_permissions : undefined
                };

                response = await usersApi.createUser(organizationId, createData);
            }

            if (response.error) {
                toast.error(response.error.message as string);
                return;
            }

            if (user) {
                toast.success("Usuário atualizado com sucesso!");
            } else {
                toast.success("Usuário criado com sucesso!");
            }
            
            return { success: true, data: response.data!, isUpdate: !!user };
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            toast.error("Erro ao salvar usuário. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    }, [user, organizationId]);

    return {
        form,
        onSubmit,
        isSubmitting
    };
}

// ===========================
// Users Navigation Hook
// ===========================

export function useUsersNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const getModeFromPath = (pathname: string): UserViewMode => {
        if (pathname.includes('/novo')) return 'create';
        if (pathname.includes('/editar')) return 'edit';
        if (pathname.match(/\/usuarios\/[^\/]+$/)) return 'view';
        return 'list';
    };

    const getUserIdFromPath = (pathname: string): string | undefined => {
        const match = pathname.match(/\/usuarios\/([^\/]+)/);
        return match ? match[1] : undefined;
    };

    const mode = getModeFromPath(location.pathname);
    const userId = getUserIdFromPath(location.pathname);

    const goToList = useCallback(() => {
        navigate('/usuarios');
    }, [navigate]);

    const goToCreate = useCallback(() => {
        navigate('/usuarios/novo');
    }, [navigate]);

    const goToView = useCallback((user: UserDetails) => {
        navigate(`/usuarios/${user.id}`);
    }, [navigate]);

    const goToEdit = useCallback((userId: string) => {
        navigate(`/usuarios/${userId}/editar`);
    }, [navigate]);

    return {
        mode,
        userId,
        goToList,
        goToCreate,
        goToView,
        goToEdit
    };
}

// ===========================
// User Detail Hook
// ===========================

export function useUserDetail(userId?: string) {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user: authUser } = useAuth();
    const organizationId = authUser?.organization_id;

    const fetchUser = useCallback(async (id: string) => {
        if (!organizationId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await usersApi.getUser(organizationId, id);

            if (response.error) {
                setError(response.error.message as string);
                return;
            }

            setUser(response.data || null);
        } catch (err) {
            console.error("Erro ao buscar usuário:", err);
            setError("Erro ao carregar usuário");
        } finally {
            setIsLoading(false);
        }
    }, [organizationId]);

    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId, fetchUser]);

    return {
        user,
        isLoading,
        error,
        refetch: () => userId && fetchUser(userId)
    };
}

// ===========================
// Main Users Hook
// ===========================

export function useUsuarios() {
    const [users, setUsers] = useState<UserDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user: authUser } = useAuth();
    const organizationId = authUser?.organization_id;

    const navigation = useUsersNavigation();
    const userDetail = useUserDetail(navigation.userId);
    
    const userForm = useUserForm(userDetail.user || undefined);

    // Função para atualizar a lista após criação/edição
    const updateUsersList = useCallback((result: { success: boolean; data: UserDetails; isUpdate: boolean }) => {
        if (!result.success || !result.data) return;
        
        if (result.isUpdate) {
            // Atualização: remover usuário antigo da lista e adicionar o novo
            setUsers((prevUsers: UserDetails[]) => {
                const filteredUsers = prevUsers.filter((u: UserDetails) => u.id !== result.data.id);
                return [...filteredUsers, result.data];
            });
        } else {
            // Criação: adicionar novo usuário à lista
            setUsers((prevUsers: UserDetails[]) => {
                return [...prevUsers, result.data];
            });
        }
    }, [setUsers]);

    const refreshUsers = useCallback(async () => {
        if (!organizationId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await usersApi.listUsers(organizationId);

            if (response.error) {
                setError(response.error.message as string);
                return;
            }

            setUsers(response.data || []);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError("Erro ao carregar usuários");
        } finally {
            setIsLoading(false);
        }
    }, [organizationId]);

    // Função para excluir usuário
    const deleteUser = useCallback(async (userId: string) => {
        if (!organizationId) return;

        try {
            const response = await usersApi.deleteUser(organizationId, userId);

            if (response.error) {
                toast.error(response.error.message as string);
                return false;
            }

            // Remover usuário da lista local
            setUsers((prevUsers: UserDetails[]) => 
                prevUsers.filter((user: UserDetails) => user.id !== userId)
            );

            toast.success("Usuário excluído com sucesso!");
            return true;
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            toast.error("Erro ao excluir usuário. Tente novamente.");
            return false;
        }
    }, [organizationId, setUsers]);

    return {
        // Navigation
        ...navigation,

        // Data
        users,
        isLoading: isLoading || userDetail.isLoading,
        error: error || userDetail.error,
        refreshUsers,
        currentUser: userDetail.user,
        deleteUser,

        // Form
        ...userForm,
        updateUsersList
    };
}
