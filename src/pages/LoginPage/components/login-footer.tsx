import { APP_CONFIG } from "@/constants";

/**
 * Componente do rodapé da página de login
 * Contém informações de copyright
 */
export function LoginFooter() {
    return (
        <p className="text-center text-xs text-muted-foreground">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            {APP_CONFIG.name}. Todos os direitos reservados.
        </p>
    );
}
