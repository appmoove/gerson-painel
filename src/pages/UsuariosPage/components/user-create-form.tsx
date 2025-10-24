import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Save, Settings } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/custom/phone-input";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CREATE_USER_FORM_DEFAULTS, createUserSchema } from "@/pages/UsuariosPage/validation";
import { maskCpfCnpj } from "@/utils/string";
import { USER_ROLES } from "@/constants";
import { usersApi } from "@/controllers";
import { toast } from "sonner";

export function UserCreateForm() {

    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: CREATE_USER_FORM_DEFAULTS,
    });

    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFormSubmit = async (data: any) => {
        try {
            setLoading(true);
            const result = await usersApi.createUser(data);
            if (result.data) {
                toast.success("Usuário criado com sucesso!");
                navigate('/usuarios/' + result.data.id);
            } else {
                toast.error("Erro ao criar usuário.");
                console.error("Error creating user:", result.error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("Erro inesperado ao criar usuário.");
        } finally {
            setLoading(false);
        }
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
                                        <FormLabel>
                                            Nome Completo <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o nome completo"
                                                disabled={loading}
                                                {...field}
                                            />
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
                                        <FormLabel>
                                            Email <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Digite o email"
                                                disabled={loading}
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
                                        <FormLabel>
                                            Documento <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="CPF ou CNPJ"
                                                value={field.value}
                                                onChange={(e) => {
                                                    const maskedValue = maskCpfCnpj(e.target.value);
                                                    field.onChange(maskedValue);
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                                maxLength={18}
                                                disabled={loading}
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
                                        <FormLabel>
                                            Telefone <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                placeholder="11 99999-9999"
                                                defaultCountry="BR"
                                                allowedCountries={["BR"]}
                                                disabled={loading}
                                                {...field}
                                            />
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
                                        <FormLabel>
                                            Cargo <span className='text-destructive'>*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={loading}
                                        >
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
                                            <Input
                                                placeholder="https://exemplo.com/imagem.jpg"
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="absolute right-2 bottom-0 flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/usuarios')}
                            disabled={loading}
                            className="cursor-pointer dark:bg-card"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {loading
                                ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </> : <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar
                                </>
                            }
                        </Button>
                    </div>
                </form>
            </Form>
        </PageContainer>
    );
}
