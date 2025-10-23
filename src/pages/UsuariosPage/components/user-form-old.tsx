import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, X } from "lucide-react";

import { useUserForm } from "../hooks";
import type { UserFormProps } from "../types";
import { USER_ROLES } from "@/constants/user";

// ===========================
// UserForm Component
// ===========================

/**
 * Componente de formulário para criação/edição de usuários
 */
export function UserForm({ user, onSuccess, updateUsersList }: UserFormProps) {
    const { form, onSubmit, isSubmitting } = useUserForm(user);

    const handleSubmit = async (data: any) => {
        const result = await onSubmit(data);
        if (result && result.data && updateUsersList) {
            updateUsersList(result);
            onSuccess();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {user ? "Editar Usuário" : "Novo Usuário"}
                </CardTitle>
            </CardHeader>
            
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Informações Básicas</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome Completo *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite o nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email" 
                                                    placeholder="Digite o email" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="document_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF/CNPJ *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="000.000.000-00 ou 00.000.000/0000-00" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="+55 11 99999-9999" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Configurações */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Configurações</h3>
                            
                            <FormField
                                control={form.control}
                                name="organization_role_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cargo *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um cargo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {USER_ROLES.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL da Imagem</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Permissões Extras */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Permissões Extras</h3>
                            
                            <FormField
                                control={form.control}
                                name="extra_permissions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Permissões Adicionais</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Digite as permissões separadas por vírgula"
                                                value={field.value?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const permissions = e.target.value
                                                        .split(",")
                                                        .map(p => p.trim())
                                                        .filter(p => p.length > 0);
                                                    field.onChange(permissions);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {user ? "Atualizar" : "Criar"} Usuário
                                    </>
                                )}
                            </Button>
                            
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onSuccess}
                                disabled={isSubmitting}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
