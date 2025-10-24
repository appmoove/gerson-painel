import * as z from "zod"

/**
 * Schema de validação para grupo de leads
 * Usa constantes para mensagens consistentes
 */
export const leadGroupSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres")
})
