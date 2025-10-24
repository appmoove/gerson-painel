import * as z from "zod"
import { AGENT_VALIDATION, AGENT_FORM_DEFAULTS } from "@/constants/agent"

// ===========================
// Validation Schemas
// ===========================

/**
 * Schema de validação para formulário de agente
 * Baseado no CreateAgentRequest do backend
 * Usa as constantes AGENT_VALIDATION para mensagens consistentes
 */
export const agentSchema = z.object({
    name: z
        .string()
        .min(1, AGENT_VALIDATION.NAME.REQUIRED)
        .min(AGENT_VALIDATION.NAME.MIN_LENGTH, AGENT_VALIDATION.NAME.MIN_LENGTH_MESSAGE)
        .max(AGENT_VALIDATION.NAME.MAX_LENGTH, AGENT_VALIDATION.NAME.MAX_LENGTH_MESSAGE),

    type: z
        .enum(['SUPPORT', 'SALES', 'GENERAL'], {
            required_error: AGENT_VALIDATION.TYPE.REQUIRED
        }),

    behaviour: z
        .string()
        .min(1, AGENT_VALIDATION.BEHAVIOUR.REQUIRED)
        .min(AGENT_VALIDATION.BEHAVIOUR.MIN_LENGTH, AGENT_VALIDATION.BEHAVIOUR.MIN_LENGTH_MESSAGE)
        .max(AGENT_VALIDATION.BEHAVIOUR.MAX_LENGTH, AGENT_VALIDATION.BEHAVIOUR.MAX_LENGTH_MESSAGE),

    characteristics: z
        .string()
        .min(1, AGENT_VALIDATION.CHARACTERISTICS.REQUIRED)
        .min(AGENT_VALIDATION.CHARACTERISTICS.MIN_LENGTH, AGENT_VALIDATION.CHARACTERISTICS.MIN_LENGTH_MESSAGE)
        .max(AGENT_VALIDATION.CHARACTERISTICS.MAX_LENGTH, AGENT_VALIDATION.CHARACTERISTICS.MAX_LENGTH_MESSAGE),

    voice_id: z
        .string()
        .min(1, AGENT_VALIDATION.VOICE_ID.REQUIRED)
})

/**
 * Schema para filtros de busca de agentes
 */
export const agentFiltersSchema = z.object({
    search: z.string().optional(),
    active: z.boolean().optional()
})
