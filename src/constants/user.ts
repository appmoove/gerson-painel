// ===========================
// User Constants
// ===========================

/**
 * Valores padrão para formulário de usuário
 */
export const USER_FORM_DEFAULTS = {
    organization_role_id: "",
    name: "",
    email: "",
    document_number: "",
    phone_number: "",
    active: true,
    image_url: "",
    extra_permissions: []
} as const;

/**
 * Cargos disponíveis na organização
 */
export const USER_ROLES = [
    {
        id: "1da2bfce-8e6a-4dd4-9cdb-5251d6d8bc06",
        name: "Administrador",
        description: "Acesso total ao sistema"
    }
] as const;

/**
 * Status de usuário
 */
export const USER_STATUS = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo"
} as const;

/**
 * Mensagens de erro comuns
 */
export const USER_ERROR_MESSAGES = {
    NOT_FOUND: "Usuário não encontrado",
    INVALID_DATA: "Dados inválidos",
    SAVE_ERROR: "Erro ao salvar usuário",
    LOAD_ERROR: "Erro ao carregar usuários",
    DELETE_ERROR: "Erro ao excluir usuário"
} as const;

/**
 * Mensagens de sucesso
 */
export const USER_SUCCESS_MESSAGES = {
    CREATED: "Usuário criado com sucesso!",
    UPDATED: "Usuário atualizado com sucesso!",
    DELETED: "Usuário excluído com sucesso!"
} as const;