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

/**
 * Formata um telefone para o padrão brasileiro
 */
export const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return "Não informado";

    // Remove tudo que não é dígito
    const cleaned = ('' + phone).replace(/\D/g, '');
    console.log(`cleaned: ${cleaned}`);

    // Tenta diferentes formatos
    // Formato: +55 (44) 98499-4825 (13 dígitos: DDI + DDD + 9 dígitos)
    const match13 = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
    console.log(`match13: ${match13}`);
    if (match13) {
        return `+${match13[1]} (${match13[2]}) ${match13[3]}-${match13[4]}`;
    }

    // Formato: +55 (44) 8499-4825 (12 dígitos: DDI + DDD + 8 dígitos - telefone fixo)
    const match12 = cleaned.match(/^(\d{2})(\d{2})(\d{4})(\d{4})$/);
    console.log(`match12: ${match12}`);
    if (match12) {
        return `+${match12[1]} (${match12[2]}) ${match12[3]}-${match12[4]}`;
    }

    // Formato: (44) 98499-4825 (11 dígitos: DDD + 9 dígitos)
    const match11 = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    console.log(`match11: ${match11}`);
    if (match11) {
        return `(${match11[1]}) ${match11[2]}-${match11[3]}`;
    }

    // Formato: (44) 8499-4825 (10 dígitos: DDD + 8 dígitos)
    const match10 = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    console.log(`match10: ${match10}`);
    if (match10) {
        return `(${match10[1]}) ${match10[2]}-${match10[3]}`;
    }

    // Se não matchou nenhum formato, retorna o original
    return phone;
};

export const formatCpfCnpj = (value: string | null) => {
    if (!value) return "Não informado";

    // Remove tudo que não é dígito
    const cleaned = ('' + value).replace(/\D/g, '');

    // CPF: 000.000.000-00 (11 dígitos)
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // CNPJ: 00.000.000/0000-00 (14 dígitos)
    if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Se não for CPF nem CNPJ, retorna o original
    return value;
};
