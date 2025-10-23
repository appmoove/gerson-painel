import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Loader2, Save, X } from "lucide-react";

import { useLeadForm } from "../hooks";
import { LeadGroupsSelector } from "./lead-groups-selector";
import type { LeadFormProps } from "../types";

/**
 * Componente de formulário para criação/edição de leads
 */
export function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const { form, isSubmitting, apiError, onSubmit, clearError } = useLeadForm(lead);

  const handleSubmit = async (data: any) => {
    const success = await onSubmit(data);
    if (success) {
      onSuccess();
    }
  };

  const handleCancel = () => {
    clearError();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      {/* Layout Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Formulário */}
        <div className="xl:col-span-2">
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-gray-900">
                Informações do Lead
              </CardTitle>
              <p className="text-sm text-gray-500">
                Preencha os dados básicos do lead
              </p>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nome *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome completo do lead"
                            {...field}
                            className="h-11 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="exemplo@email.com"
                            {...field}
                            className="h-11 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Telefone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Telefone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(11) 99999-9999"
                            {...field}
                            className="h-11 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Erro da API */}
                  {apiError && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">{apiError}</p>
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-11 text-base font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {lead ? 'Atualizar Lead' : 'Criar Lead'}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="h-11 px-6 text-base font-medium"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Seleção de Grupos */}
        <div className="xl:col-span-1">
          <LeadGroupsSelector
            selectedGroups={form.watch('groups') || []}
            onGroupsChange={(groups) => form.setValue('groups', groups)}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
