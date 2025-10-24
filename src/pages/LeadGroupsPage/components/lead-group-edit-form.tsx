import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Save, X, Users } from "lucide-react"
import { useLeadGroupForm } from "../hooks"
import type { LeadGroupEditFormProps } from "../types"

// ===========================
// LeadGroupEditForm Component
// ===========================

/**
 * Formulário para edição de grupos de leads existentes
 */
export function LeadGroupEditForm({
    leadGroup,
    onSave,
    onCancel,
    isLoading = false,
}: LeadGroupEditFormProps) {
    const { form, isSubmitting, submitError, onSubmit, clearError } = useLeadGroupForm(leadGroup)

    const handleSubmit = async (data: any) => {
        const result = await onSubmit(data)
        if (result?.success) {
            onSave()
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Editar Grupo de Leads
                </CardTitle>
                <CardDescription>
                    Atualize as informações do grupo de leads "{leadGroup.name}".
                </CardDescription>
            </CardHeader>
            
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Grupo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: PMEs - Consultoria"
                                            {...field}
                                            disabled={isSubmitting || isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {submitError && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {submitError}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    clearError()
                                    onCancel()
                                }}
                                disabled={isSubmitting || isLoading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
