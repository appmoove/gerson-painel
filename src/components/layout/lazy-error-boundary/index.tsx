import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class LazyLoadErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Lazy loading error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Erro ao carregar página</h3>
                        <p className="text-muted-foreground">
                            Ocorreu um erro inesperado ao carregar esta página.
                        </p>
                        {this.state.error && (
                            <details className="text-sm text-muted-foreground mt-2">
                                <summary className="cursor-pointer">Detalhes do erro</summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                    <Button onClick={this.handleRetry} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Tentar novamente
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
