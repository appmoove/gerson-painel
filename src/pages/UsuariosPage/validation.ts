import * as z from "zod";
import { validateCPF, validateCNPJ } from "@/utils/string";

// ===========================
// User Validation Schemas
// ===========================

/**
 * Schema de validação para formulário de criação de usuário
 */
export const createUserSchema = z.object({
    name: z.string().min(4, "Digite um nome válido"),
    email: z.email("Email inválido").trim(),
    document_number: z.string()
        .min(1, "Documento é obrigatório")
        .refine((val) => {
            const cleaned = val.replace(/\D/g, '');
            return cleaned.length === 11 || cleaned.length === 14;
        }, {
            message: "Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos)"
        })
        .refine(val => {
            const cleaned = val.replace(/\D/g, '');
            // Verifica o tamanho e aplica validações específicas
            if (cleaned.length === 11) {
                return validateCPF(cleaned);
            }

            if (cleaned.length === 14) {
                return validateCNPJ(cleaned);
            }

            return false;
        }, {
            message: "Documento inválido"
        }).transform(val => val.replace(/\D/g, '')),
    phone_number: z.string()
        .min(10, "Telefone deve ter pelo menos 10 dígitos"),
    organization_role_id: z.uuid("Selecione um cargo válido"),
    image_url: z.string().optional(),
});

/**
 * Schema de validação para formulário de edição de usuário
 */
export const editUserSchema = createUserSchema.extend({
    active: z.boolean()
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
 * Valores padrão para formulário de criação de usuário
 */
export const CREATE_USER_FORM_DEFAULTS = {
    organization_role_id: "",
    name: "",
    email: "",
    document_number: "",
    phone_number: "",
    image_url: "",
} as const;

/**
 * Valores padrão para formulário de edição de usuário
 */
export const EDIT_USER_FORM_DEFAULTS = {
    ...CREATE_USER_FORM_DEFAULTS,
    active: true
} as const;
