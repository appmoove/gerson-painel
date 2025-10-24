import { lazy } from "react";
import { withLazyLoading } from "../lazy-route";

/**
 * Utilitário para criar componentes lazy com loading automaticamente aplicado
 */
export function createLazyComponent(importFunction: () => Promise<{ default: React.ComponentType }>) {
    return withLazyLoading(lazy(importFunction));
}

/**
 * Utilitário para criar componentes lazy de submódulos com loading automaticamente aplicado
 */
export function createLazySubComponent(
    importFunction: () => Promise<Record<string, React.ComponentType<unknown>>>,
    componentName: string
) {
    return withLazyLoading(
        lazy(() => importFunction().then(module => ({ default: module[componentName] })))
    );
}