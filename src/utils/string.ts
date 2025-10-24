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

/**
 * Aplica máscara dinâmica em tempo real para CPF/CNPJ
 * Funciona conforme o usuário digita, adaptando automaticamente
 */
export const maskCpfCnpj = (value: string): string => {
    if (!value) return "";

    // Remove tudo que não é dígito
    const cleaned = value.replace(/\D/g, '');
    
    // Limita a 14 dígitos (CNPJ)
    const limited = cleaned.substring(0, 14);
    
    // Aplica máscara baseada no comprimento
    if (limited.length <= 11) {
        // Máscara de CPF: 000.000.000-00
        return limited
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // Máscara de CNPJ: 00.000.000/0000-00
        return limited
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
};

/**
 * Valida CPF ou CNPJ dinamicamente
 * Retorna true se o documento estiver completo e válido
 */
export const validateDocument = (value: string): boolean => {
    if (!value) return false;
    
    const cleaned = value.replace(/\D/g, '');
    
    // Verifica se tem o número correto de dígitos
    if (cleaned.length === 11) {
        return validateCPF(cleaned);
    } else if (cleaned.length === 14) {
        return validateCNPJ(cleaned);
    }
    
    return false;
};

export const validateCPF = (cpf: string): boolean => {
    let sum = 0
    let remaining: number

    const strCPF = String(cpf).replace(/[^\d]/g, '')

    if (strCPF.length !== 11)
        return false

    if ([
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ].indexOf(strCPF) !== -1)
        return false

    for (let i = 1; i <= 9; i++)
        sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

    remaining = (sum * 10) % 11

    if ((remaining == 10) || (remaining == 11))
        remaining = 0

    if (remaining != parseInt(strCPF.substring(9, 10)))
        return false

    sum = 0

    for (let i = 1; i <= 10; i++)
        sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i)

    remaining = (sum * 10) % 11

    if ((remaining == 10) || (remaining == 11))
        remaining = 0

    if (remaining != parseInt(strCPF.substring(10, 11)))
        return false

    return true
};

export const validateCNPJ = (cnpj: string): boolean => {
    const b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const c = String(cnpj).replace(/[^\d]/g, '')

    if (c.length !== 14)
        return false

    if (/0{14}/.test(c))
        return false

    let n = 0
    for (let i = 0; i < 12; i++) {
        n += Number(c[i]) * b[i + 1]
    }
    if (Number(c[12]) !== (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    n = 0
    for (let i = 0; i <= 12; i++) {
        n += Number(c[i]) * b[i]
    }
    if (Number(c[13]) !== (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    return true
}
