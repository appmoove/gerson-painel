import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Edit, User, Mail, Phone, Calendar } from "lucide-react";

import type { UserListProps } from "../types";

// ===========================
// UsersList Component
// ===========================

/**
 * Componente de listagem de usuários
 */
export function UsersList({ users, isLoading, onView, onEdit }: UserListProps) {
    if (isLoading) {
        return <UsersListSkeleton />;
    }

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                    <p className="text-muted-foreground text-center">
                        Não há usuários cadastrados na organização ainda.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    onView={() => onView(user)}
                    onEdit={() => onEdit(user)}
                />
            ))}
        </div>
    );
}

// ===========================
// UserCard Component
// ===========================

interface UserCardProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        phone_number: string | null;
        active: boolean | null;
        created_at: Date | null;
    };
    onView: () => void;
    onEdit: () => void;
}

function UserCard({ user, onView, onEdit }: UserCardProps) {
    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("pt-BR");
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base">
                                {user.name || "Nome não informado"}
                            </CardTitle>
                            <Badge variant={user.active ? "default" : "secondary"} className="mt-1">
                                {user.active ? "Ativo" : "Inativo"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                    {user.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{user.email}</span>
                        </div>
                    )}
                    
                    {user.phone_number && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{user.phone_number}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em {formatDate(user.created_at)}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onView}
                        className="flex-1"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="flex-1"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ===========================
// UsersListSkeleton Component
// ===========================

function UsersListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        
                        <div className="flex gap-2">
                            <Skeleton className="h-8 flex-1" />
                            <Skeleton className="h-8 flex-1" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
