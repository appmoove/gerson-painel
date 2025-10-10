import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { UserDetails } from "@/types/user-api";

// ===========================
// DeleteUserModal Props
// ===========================

interface DeleteUserModalProps {
    /** Usuário a ser excluído */
    user: UserDetails | null;
    /** Se o modal está aberto */
    isOpen: boolean;
    /** Se está processando a exclusão */
    isDeleting: boolean;
    /** Callback para fechar o modal */
    onClose: () => void;
    /** Callback para confirmar a exclusão */
    onConfirm: () => void;
}

// ===========================
// DeleteUserModal Component
// ===========================

/**
 * Modal de confirmação para exclusão de usuários
 * Exibe informações do usuário e solicita confirmação antes da exclusão
 */
export function DeleteUserModal({
    user,
    isOpen,
    isDeleting,
    onClose,
    onConfirm
}: DeleteUserModalProps) {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Confirmar Exclusão
                    </DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita. O usuário será permanentemente removido da organização.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Informações do usuário */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Usuário a ser excluído:</h4>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Nome:</span> {user.name || "Não informado"}</p>
                            <p><span className="font-medium">Email:</span> {user.email || "Não informado"}</p>
                            <p><span className="font-medium">Status:</span> 
                                <span className={`ml-1 ${user.active ? 'text-green-600' : 'text-red-600'}`}>
                                    {user.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Alerta de aviso */}
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Atenção:</strong> Todos os dados relacionados a este usuário serão perdidos permanentemente, 
                            incluindo histórico de atividades e permissões.
                        </AlertDescription>
                    </Alert>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Excluindo...
                            </>
                        ) : (
                            "Confirmar Exclusão"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
