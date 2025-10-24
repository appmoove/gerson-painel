/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, Save, Settings } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/custom/phone-input";
import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { EDIT_USER_FORM_DEFAULTS, editUserSchema } from "@/pages/UsuariosPage/validation";
import { maskCpfCnpj } from "@/utils/string";
import { USER_ROLES } from "@/constants";
import { usersApi } from "@/controllers";


export function UserEditForm() {
    const [loadingGet, setLoadingGet] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: EDIT_USER_FORM_DEFAULTS
    });

    const getUserData = async (userId: string) => {
        if (!userId) {
            return;
        }

        try {
            setLoadingGet(true);
            const { data } = await usersApi.getUser(userId);

            if (!data || !data.id) {
                toast.error("Usuário não encontrado.");
                navigate(-1);
                return;
            }

            // Preenche o formulário com os dados carregados
            form.reset({
                organization_role_id: data.organization_role_id || "",
                name: data.name || "",
                email: data.email || "",
                document_number: maskCpfCnpj(data.document_number || ""), // Aplica máscara nos dados da API
                phone_number: data.phone_number || "",
                image_url: data.image_url || "",
                active: data.active ?? true,
            });
        } catch (error: any) {
            toast.error("Erro ao carregar dados do usuário", {
                description: error.message || 'Erro desconhecido.'
            });
            navigate(-1);
        } finally {
            setLoadingGet(false);
        }
    }

    const handleFormSubmit = async (data: any) => {
        if (!id) {
            toast.error("ID do usuário não encontrado.");
            return;
        }

        try {
            setLoadingUpdate(true);
            const result = await usersApi.updateUser(id, data);
            if (result.data) {
                toast.success("Usuário atualizado com sucesso!");
                navigate('/usuarios/' + result.data.id);
            } else {
                toast.error("Erro ao atualizar usuário.");
                console.error("Error updating user:", result.error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("Erro inesperado ao atualizar usuário.");
        } finally {
            setLoadingUpdate(false);
        }
    }

    useEffect(() => {
        if (id) {
            getUserData(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const breadcrumbs = [
        { label: 'Dashboard', to: '/' },
        { label: 'Usuários', to: '/usuarios' },
        { label: form.getValues("name") || "Usuário", to: `/usuarios/${id}` },
        { label: 'Editar' },
    ];

    return (
        <PageContainer
            title="Editar Usuário"
            subtitle="Atualize as informações do usuário."
            breadcrumbs={breadcrumbs}
        >
            <Form {...form}>
                <AnimatePresence>
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Informações Básicas
                                </CardTitle>
                                <CardAction>
                                    {loadingGet && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
                                </CardAction>
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
                                                {loadingGet
                                                    ? <Skeleton className="h-9 w-full rounded-md" />
                                                    : <Input
                                                        placeholder="Digite o nome completo"
                                                        disabled={loadingUpdate}
                                                        {...field}
                                                    />
                                                }
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
                                                {loadingGet
                                                    ? <Skeleton className="h-9 w-full rounded-md" />
                                                    : <Input
                                                        type="email"
                                                        placeholder="Digite o email"
                                                        disabled={loadingUpdate}
                                                        {...field}
                                                    />
                                                }
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
                                                {loadingGet
                                                    ? <Skeleton className="h-9 w-full rounded-md" />
                                                    : <Input
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
                                                        disabled={loadingUpdate}
                                                    />
                                                }
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
                                                {loadingGet
                                                    ? <Skeleton className="h-9 w-full rounded-md" />
                                                    : <PhoneInput
                                                        placeholder="11 99999-9999"
                                                        defaultCountry="BR"
                                                        allowedCountries={["BR"]}
                                                        disabled={loadingUpdate}
                                                        {...field}
                                                    />
                                                }
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
                                <CardAction>
                                    {loadingGet && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
                                </CardAction>
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
                                                disabled={loadingUpdate}
                                            >
                                                <FormControl>
                                                    {loadingGet
                                                        ? <Skeleton className="h-9 w-full rounded-md" />
                                                        : <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione um cargo" />
                                                        </SelectTrigger>
                                                    }
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
                                    name="active"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status do Usuário</FormLabel>
                                            <FormControl>
                                                {loadingGet
                                                    ? <Skeleton className="h-6 w-12 rounded-full" />
                                                    : <div className="flex items-center space-x-3">
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            disabled={loadingUpdate}
                                                        />
                                                        <Label
                                                            htmlFor="active"
                                                            className="text-sm font-medium"
                                                            onClick={() => field.onChange(!field.value)}
                                                        >
                                                            {field.value ? 'Ativo' : 'Inativo'}
                                                        </Label>
                                                    </div>
                                                }
                                            </FormControl>
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
                                                {loadingGet
                                                    ? <Skeleton className="h-9 w-full rounded-md" />
                                                    : <Input
                                                        placeholder="https://exemplo.com/imagem.jpg"
                                                        disabled={loadingUpdate}
                                                        {...field}
                                                    />
                                                }
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
                                disabled={loadingUpdate || loadingGet}
                                className="cursor-pointer dark:bg-card"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loadingUpdate || loadingGet}
                                className="cursor-pointer"
                            >
                                {loadingGet && (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Carregando...
                                    </>
                                )}
                                {!loadingGet && (loadingUpdate
                                    ? <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </> : <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.form>
                </AnimatePresence>
            </Form>
        </PageContainer>
    );
}
