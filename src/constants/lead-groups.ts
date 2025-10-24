// ===========================
// Lead Groups Constants
// ===========================

/**
 * Constantes para validação de grupos de leads
 */
export const LEAD_GROUP_VALIDATION = {
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
        REQUIRED: true
    }
} as const

/**
 * Labels e textos para formulários
 */
export const LEAD_GROUP_LABELS = {
    NAME: 'Nome do Grupo',
    NAME_PLACEHOLDER: 'Ex: PMEs - Consultoria',
    CREATE_TITLE: 'Criar Novo Grupo de Leads',
    EDIT_TITLE: 'Editar Grupo de Leads',
    CREATE_DESCRIPTION: 'Preencha os dados abaixo para criar um novo grupo de leads.',
    EDIT_DESCRIPTION: 'Atualize as informações do grupo de leads.'
} as const

/**
 * Mensagens de feedback
 */
export const LEAD_GROUP_MESSAGES = {
    CREATE_SUCCESS: 'Grupo de leads criado!',
    UPDATE_SUCCESS: 'Grupo de leads atualizado!',
    DELETE_SUCCESS: 'Grupo de leads excluído!',
    CREATE_ERROR: 'Erro ao criar grupo de leads',
    UPDATE_ERROR: 'Erro ao atualizar grupo de leads',
    DELETE_ERROR: 'Erro ao excluir grupo de leads',
    LOAD_ERROR: 'Erro ao carregar grupos de leads',
    NOT_FOUND: 'Grupo de leads não encontrado',
    EMPTY_LIST: 'Nenhum grupo de leads encontrado',
    EMPTY_DESCRIPTION: 'Crie seu primeiro grupo de leads para começar a organizar seus contatos.'
} as const

/**
 * Configurações de paginação e layout
 */
export const LEAD_GROUP_CONFIG = {
    CARDS_PER_ROW: {
        MOBILE: 1,
        TABLET: 2,
        DESKTOP: 3
    },
    SKELETON_COUNT: 6,
    MAX_WIDTH: 'max-w-4xl'
} as const
