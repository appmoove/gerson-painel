import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface SearchModalProps {
    /** Callback para busca */
    onSearch?: (query: string) => void;
    /** Placeholder do campo de busca */
    searchPlaceholder?: string;
    /** Estado de abertura do modal */
    isOpen: boolean;
    /** Callback para fechar o modal */
    onClose: () => void;
    /** Classes CSS adicionais */
    className?: string;
}

export function SearchModal({
    onSearch,
    searchPlaceholder = "Buscar agentes, rotinas, usuários...",
    isOpen,
    onClose,
    className,
}: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Limpar campo quando modal fechar
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
            setIsSearchFocused(false);
        }
    }, [isOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch && searchQuery.trim()) {
            onSearch(searchQuery.trim());
            onClose();
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className={cn(
                    "sm:max-w-md mx-4",
                    className
                )}
                onKeyDown={handleKeyDown}
            >
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Pesquisar
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSearchSubmit} className="space-y-4">
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
                                "pl-10 pr-4 h-12 text-base transition-all duration-200",
                                isSearchFocused && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                            )}
                            autoFocus
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!searchQuery.trim()}
                            className="flex-1"
                        >
                            Pesquisar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
