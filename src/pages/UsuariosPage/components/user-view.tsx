/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, CheckCircle, Edit, ImageIcon, Mail, Phone, Shield, Trash2, User, XCircle } from "lucide-react";
import { toast } from "sonner";

import { UserViewSkeletonCards } from "./user-view-skeleton-cards";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserDetails } from "@/types";
import { motion } from "framer-motion";

import { USER_ROLES } from "@/constants";
import { usersApi } from "@/controllers";
import { formatCpfCnpj, formatPhoneNumber } from "@/utils/string";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DeleteUserModal } from "./delete-user-modal";

export function UserView() {
    const [user, setUser] = useState<UserDetails>();
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const getUserData = async (userId: string) => {
        if (!userId) {
            setUser(undefined);
            return;
        }

        try {
            setLoading(true);
            const { data } = await usersApi.getUser(userId);

            if (!data || !data.id) {
                toast.error("Usuário não encontrado.");
                setUser(undefined);
                navigate(-1);
                return;
            }

            setUser(data);
        } catch (error: any) {
            toast.error("Erro ao carregar dados do usuário", {
                description: error.message || 'Erro desconhecido.'
            });
            setUser(undefined);
            navigate(-1);
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = async () => {
        if (!user) return;

        try {
            setIsDeleting(true);
            await usersApi.deleteUser(user.id);
            toast.success("Usuário excluído com sucesso.");
            navigate(-1);
        } catch (error: any) {
            toast.error("Erro ao excluir usuário", {
                description: error.message || 'Erro desconhecido.'
            });
        } finally {
            setIsDeleting(false);
        }
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

    useEffect(() => {
        if (id) {
            getUserData(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getExtra = () => (
        <>
            <Link to={`/usuarios/${user?.id}/editar`}>
                <Button className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                </Button>
            </Link>
            <Button variant="destructive" className="ml-2 cursor-pointer" onClick={() => setDeleteModalOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
            </Button>
        </>
    )

    const breadcrumbs = [
        { label: 'Dashboard', to: '/' },
        { label: 'Usuários', to: '/usuarios' },
        { label: 'Detalhes' },
    ];

    return (
        <PageContainer
            title="Detalhes do Usuário"
            subtitle="Visualize e edite as informações do usuário."
            breadcrumbs={breadcrumbs}
            extra={getExtra()}
        >
            {loading && <UserViewSkeletonCards />}
            {!loading && user && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                >
                    {/* Dados principais */}
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
                                    <CardTitle className="text-xl">
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
                                            {formatPhoneNumber(user.phone_number)}
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
                                            {formatCpfCnpj(user.document_number)}
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
                </motion.div>
            )}
            {user && (
                <DeleteUserModal
                    user={user}
                    isOpen={deleteModalOpen}
                    isDeleting={isDeleting}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={deleteUser}
                />
            )}
        </PageContainer>
    )
}
