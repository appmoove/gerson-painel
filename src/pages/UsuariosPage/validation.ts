import * as z from "zod";

// ===========================
// User Validation Schemas
// ===========================

/**
 * Schema de validação para formulário de usuário
 */
export const userSchema = z.object({
    organization_role_id: z.string().uuid("ID do cargo deve ser um UUID válido"),
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    document_number: z.string().optional(),
    phone_number: z.string().optional(),
    active: z.boolean().default(true),
    image_url: z.string().url("URL inválida").optional().or(z.literal("")),
    extra_permissions: z.array(z.string()).optional()
});

/**
 * Schema de validação para busca de usuários
 */
export const userSearchSchema = z.object({
    search: z.string().optional(),
    active: z.boolean().optional(),
    role: z.string().optional()
});

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
