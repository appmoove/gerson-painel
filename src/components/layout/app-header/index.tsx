import React, { useState } from "react";
import { Search, Bell, Brain, Sidebar } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { APP_CONFIG } from "@/constants";

export interface AppHeaderProps {
    /** Callback para busca */
    onSearch?: (query: string) => void;
    /** Placeholder do campo de busca */
    searchPlaceholder?: string;
    /** Classes CSS adicionais */
    className?: React.HTMLAttributes<HTMLElement>['className'];
}

export function AppHeader({
    onSearch,
    searchPlaceholder = "Buscar agentes, rotinas, usuários...",
    className,
}: AppHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { isMobile, toggleSidebar } = useSidebar();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch && searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                className
            )}
        >
            <div className="flex h-16 items-center justify-between px-6">

                {/* Container para cercar o sidebar toggle e a logo */}
                <div className="flex items-center gap-4">

                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 relative hover:bg-muted cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={toggleSidebar}
                        >
                            <Sidebar className="h-5 w-5" />
                            <span className="sr-only">Abrir menu lateral</span>
                        </Button>
                    )}


                    {/* Lado esquerdo - Logo e Nome */}
                    <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 flex-shrink-0" color="var(--primary)" />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-md font-semibold text-foreground">
                                {APP_CONFIG.name}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {APP_CONFIG.minor_description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Centro - Buscador */}
                {!isMobile && (
                    <div className="flex items-center justify-center flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearchSubmit} className="w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className={cn(
                                        "pl-10 pr-4 h-10 transition-all duration-200",
                                        isSearchFocused && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                                    )}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {/* Lado direito - Acesso rápido */}
                <div className="flex items-center gap-2">
                    {/* Botão de busca - Mobile */}
                    {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 relative hover:bg-muted cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Buscar</span>
                        </Button>
                    )}

                    {/* Notificações */}
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 relative hover:bg-muted cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <Bell className="h-4 w-4" />
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    3
                                </Badge>
                                <span className="sr-only">Notificações</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <p>Notificação 1</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <p>Notificação 2</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <p>Notificação 3</p>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div >
        </header >
    );
}
