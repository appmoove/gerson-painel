import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Save, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_ROLES } from "@/constants";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { validateCNPJ, validateCPF } from "@/utils/string";

const formUtils = {
    userSchema: z.object({
        organization_role_id: z.uuid("Selecione um cargo válido"),
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.email("Email inválido"),
        document_number: z.string()
            .refine((val) => {
                const cleaned = val.replace(/\D/g, '');
                return cleaned.length === 11 || cleaned.length === 14;
            }, {
                message: "Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos)"
            })
            // Valida CPF ou CNPJ básico
            .refine(val => {
                const cleaned = val.replace(/\D/g, '');
                // Verifica o tamanho e aplica validações específicas
                if (cleaned.length === 11) {
                    return validateCPF(cleaned);
                }

                if (cleaned.length === 14) {
                    return validateCNPJ(cleaned);
                }

                return false;
            }, {
                message: "Documento inválido"
            }),
        phone_number: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
        image_url: z.string().optional(),
    })
}

export function UserForm() {

    const [loading, setLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            organization_role_id: "",
            name: "",
            email: "",
            document_number: "",
            phone_number: "",
            image_url: "",
        }
    });

    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFormSubmit = (data: any) => {
        console.log("Form submitted:", data);
    }

    const breadcrumbs = [
        { label: 'Dashboard', to: '/' },
        { label: 'Usuários', to: '/usuarios' },
        { label: 'Novo' },
    ];

    return (
        <PageContainer
            title="Criar Novo Usuário"
            subtitle="Preencha as informações do novo usuário."
            breadcrumbs={breadcrumbs}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Informações Básicas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome Completo <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o nome completo" {...field} required />
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
                            <FormField
                                control={form.control}
                                name="document_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF/CNPJ *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CPF ou CNPJ" {...field} />
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
                                            <Input placeholder="+55 11 99999-9999" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Configurações
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="organization_role_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cargo *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
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
                        </CardContent>
                    </Card>
                </form>

                <div className="absolute right-2 bottom-0 flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/usuarios')}
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </Form>
        </PageContainer>
    );
}
