import * as z from "zod";

// ===========================
// Lead Validation Schemas
// ===========================

/**
 * Schema de validação para formulário de lead
 * Valida nome, email, telefone e grupos com regras específicas
 */
export const leadSchema = z.object({
  /** Nome do lead - obrigatório, mínimo 2 caracteres */
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),

  /** Email do lead - opcional, mas se preenchido deve ser válido */
  email: z
    .string()
    .refine(
      (email) => {
        if (!email || email.trim() === "") return true;
        return z.string().email().safeParse(email).success;
      },
      "Email deve ter um formato válido"
    )
    .transform((email) => email?.trim() || ""),

  /** Telefone do lead - opcional, mas se preenchido deve ter formato válido */
  phone: z
    .string()
    .refine(
      (phone) => {
        if (!phone || phone.trim() === "") return true;
        // Remove caracteres não numéricos exceto +
        const cleanPhone = phone.replace(/[^\d+]/g, "");
        // Deve ter pelo menos 10 dígitos (formato brasileiro mínimo)
        return cleanPhone.length >= 10;
      },
      "Telefone deve ter pelo menos 10 dígitos"
    )
    .transform((phone) => phone?.trim() || ""),

  /** Grupos do lead - array de IDs de grupos */
  groups: z
    .array(z.string())
    .default([]),
});

/**
 * Schema para validação de filtros de busca
 */
export const leadFiltersSchema = z.object({
  /** Filtro por nome */
  name: z.string().optional(),
  /** Filtro por email */
  email: z.string().optional(),
  /** Filtro por telefone */
  phone: z.string().optional(),
});

/**
 * Tipo inferido do schema de lead
 */
export type LeadFormData = z.infer<typeof leadSchema>;

/**
 * Tipo inferido do schema de filtros
 */
export type LeadFiltersData = z.infer<typeof leadFiltersSchema>;
