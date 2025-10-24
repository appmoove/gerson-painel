import { useFormContext } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { TextareaWithCounter } from "@/components/custom/textarea-with-counter"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mic, User, Volume2 } from "lucide-react"

import { AGENT_VALIDATION } from "@/constants/agent"
import type { Voice } from "@/types"
import type { AgentFormData } from "@/pages/AgentesPage/types"

// ===========================
// Form Field Components
// ===========================

/**
 * Campo Nome do agente
 */
export function AgentNameField() {
    const { control } = useFormContext<AgentFormData>()

    return (
        <FormField
            control={control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nome do Agente *</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Ex: Atendente Virtual"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

/**
 * Campo Tipo do agente
 */
export function AgentTypeField() {
    const { control } = useFormContext<AgentFormData>()

    return (
        <FormField
            control={control}
            name="type"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo do Agente *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="SUPPORT">Suporte</SelectItem>
                            <SelectItem value="SALES">Vendas</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

/**
 * Campo Comportamento do agente
 */
export function AgentBehaviourField() {
    const { control } = useFormContext<AgentFormData>()

    return (
        <FormField
            control={control}
            name="behaviour"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Comportamento *</FormLabel>
                    <FormControl>
                        <TextareaWithCounter
                            placeholder="Descreva como o agente deve se comportar, sua abordagem e estilo de comunicação..."
                            rows={4}
                            showWordCount={false}
                            showCharCount={true}
                            maxLength={AGENT_VALIDATION.BEHAVIOUR.MAX_LENGTH}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

/**
 * Campo Características do agente
 */
export function AgentCharacteristicsField() {
    const { control } = useFormContext<AgentFormData>()

    return (
        <FormField
            control={control}
            name="characteristics"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Características *</FormLabel>
                    <FormControl>
                        <TextareaWithCounter
                            placeholder="Descreva as características específicas do agente, suas habilidades e qualidades..."
                            rows={4}
                            showWordCount={false}
                            showCharCount={true}
                            maxLength={AGENT_VALIDATION.CHARACTERISTICS.MAX_LENGTH}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

/**
 * Campo de Voz do agente
 */
export function AgentVoiceField({ voices }: { voices: Voice[] }) {
    const { control } = useFormContext<AgentFormData>()

    return (
        <FormField
            control={control}
            name="voice_id"
            render={({ field }) => {
                const selectedVoice = field.value ? voices.find(voice => voice.id === field.value) : null

                return (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <Mic className="h-4 w-4 text-primary" />
                            Voz do Agente *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                                <SelectTrigger className="w-full h-12">
                                    <SelectValue placeholder="🎤 Escolha a voz para seu agente">
                                        {field.value && selectedVoice ? (
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                                                    <Volume2 className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                    <span className="font-medium text-sm truncate">{selectedVoice.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 flex-1">
                                                            {selectedVoice.description}
                                                        </p>
                                                        <Badge
                                                            variant={selectedVoice.gender === 'MALE' ? 'default' : 'secondary'}
                                                            className={`text-xs px-2 py-0.5 flex-shrink-0 ${selectedVoice.gender === 'FEMALE'
                                                                ? 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
                                                                : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                                }`}
                                                        >
                                                            {selectedVoice.gender === 'MALE' ? 'Masculino' : 'Feminino'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mic className="h-4 w-4" />
                                                <span>Escolha a voz para seu agente</span>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-80">
                                {voices.map((voice) => (
                                    <SelectItem key={voice.id} value={voice.id} className="p-3">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 flex-shrink-0">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex items-center justify-between w-full min-w-0">
                                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                    <span className="font-medium text-sm truncate">{voice.name}</span>
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                                                        {voice.description}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={voice.gender === 'MALE' ? 'default' : 'secondary'}
                                                    className={`text-xs px-2 py-0.5 ml-2 flex-shrink-0 ${voice.gender === 'FEMALE'
                                                        ? 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
                                                        : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                        }`}
                                                >
                                                    {voice.gender === 'MALE' ? 'Masculino' : 'Feminino'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}

