import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    Shield, 
    Image as ImageIcon,
    CheckCircle,
    XCircle
} from "lucide-react";

import type { UserViewProps } from "../types";
import { USER_ROLES } from "@/constants/user";

// ===========================
// UserView Component
// ===========================

/**
 * Componente de visualização detalhada de usuário
 */
export function UserView({ user, isLoading }: UserViewProps) {
    if (isLoading) {
        return <UserViewSkeleton />;
    }

    if (!user) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Usuário não encontrado</h3>
                    <p className="text-muted-foreground text-center">
                        O usuário solicitado não foi encontrado ou não existe.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getRoleName = (roleId: string | null) => {
        if (!roleId) return "Não definido";
        const role = USER_ROLES.find(r => r.id === roleId);
        return role ? role.name : "Cargo não encontrado";
    };

    return (
        <div className="space-y-6">
            {/* Informações Principais */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            {user.image_url ? (
                                <img 
                                    src={user.image_url} 
                                    alt={user.name || "Usuário"} 
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-8 w-8 text-primary" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">
                                {user.name || "Nome não informado"}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant={user.active ? "default" : "secondary"}>
                                    {user.active ? (
                                        <>
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Ativo
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Inativo
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Informações de Contato */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Informações de Contato
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">
                                    {user.email || "Não informado"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Telefone</p>
                                <p className="text-sm text-muted-foreground">
                                    {user.phone_number || "Não informado"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {user.document_number && (
                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Documento</p>
                                <p className="text-sm text-muted-foreground">
                                    {user.document_number}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Informações do Sistema */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Informações do Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Cargo</p>
                                <p className="text-sm text-muted-foreground">
                                    {getRoleName(user.organization_role_id)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Imagem</p>
                                <p className="text-sm text-muted-foreground">
                                    {user.image_url ? "Definida" : "Não definida"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {user.extra_permissions && user.extra_permissions.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Permissões Extras</p>
                            <div className="flex flex-wrap gap-2">
                                {user.extra_permissions?.map((permission: string, index: number) => (
                                    <Badge key={index} variant="outline">
                                        {permission}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Informações de Data */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Datas
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Criado em</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(user.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Atualizado em</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(user.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {user.deleted_at && (
                        <div className="flex items-center gap-3">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <div>
                                <p className="text-sm font-medium text-destructive">Excluído em</p>
                                <p className="text-sm text-destructive">
                                    {formatDate(user.deleted_at)}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ===========================
// UserViewSkeleton Component
// ===========================

function UserViewSkeleton() {
    return (
        <div className="space-y-6">
            {/* Informações Principais */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div>
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Informações de Contato */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>

            {/* Informações do Sistema */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>

            {/* Informações de Data */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
