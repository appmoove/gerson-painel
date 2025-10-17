import moment from "moment-timezone";

export const stringLimit = (str: string, limit: number, end: string = "...") => {
    if (str.length <= limit) {
        return str;
    }
    return str.substring(0, limit) + end;
}

// ===========================
// Phone Parsing Utilities
// ===========================

/**
 * Normaliza um telefone removendo caracteres especiais e formatando
 */
export const normalizePhone = (phone: string): string => {
    // Remove tudo exceto números, parênteses, hífen e espaços
    const cleaned = phone.replace(/[^\d\s\-()]/g, '')
    return cleaned.trim()
}

// ===========================
// Date Formatting Utilities
// ===========================

/**
 * Obtém o fuso horário do usuário
 * @returns Fuso horário do usuário
 */
export const getUserTimezone = (): string => moment.tz.guess();

/**
 * Formata uma data e hora para o formato DD/MM/YYYY HH:mm:ss
 * @param date Data e hora a ser formatada
 * @returns Data e hora formatada
 */
export const formatDateTimeUTCToLocal = (utcDate: string, format = 'DD/MM/YYYY HH:mm', timezone: string = getUserTimezone()) => {
    return moment.utc(utcDate).tz(timezone).format(format);
};


