import { Suspense } from "react";
import { PageLoading } from "@/components/layout/page-loading";
import { LazyLoadErrorBoundary } from "@/components/layout/lazy-error-boundary";

/**
 * HOC que envolve um componente lazy com Suspense e ErrorBoundary
 */
export function withLazyLoading<T extends object>(Component: React.ComponentType<T>) {
    return function LazyWrapper(props: T) {
        return (
            <LazyLoadErrorBoundary>
                <Suspense fallback={<PageLoading />}>
                    <Component {...props} />
                </Suspense>
            </LazyLoadErrorBoundary>
        );
    };
}
