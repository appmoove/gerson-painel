import { Brain } from "lucide-react";

/**
 * Componente do cabeçalho da página de login
 * Contém logo, nome e descrição do Gerson
 */
export function LoginHeader() {
    return (
        <div className="flex flex-col gap-2 text-center items-center select-none">
            {/* Logo do Gerson */}
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
            </div>

            {/* Nome do Gerson */}
            <h1 className="text-2xl font-medium">Gerson</h1>

            {/* Descrição do Gerson */}
            <p className="text-muted-foreground">Sistema de Call Center Automatizado</p>
        </div>
    );
}
