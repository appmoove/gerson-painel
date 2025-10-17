import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAudioPlayback } from "@/contexts/audio-player-context";
import { cn } from "@/lib/utils";

import type { Voice } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AudioPlayerProps {
    voice: Voice;
    waveform?: number[]; // Array de valores para audiolines (será normalizado para 0-100)
    seekable?: boolean;
    className?: string;
}

/**
 * Normaliza array de valores para range 0-100
 */
const normalizeWaveform = (values: number[]): number[] => {
    if (values.length === 0) return [];

    const max = Math.max(...values);
    const min = Math.min(...values);

    // Se todos valores iguais, retorna 50 para todos
    if (max === min) return values.map(() => 50);

    return values.map(v => ((v - min) / (max - min)) * 100);
};

/**
 * Reamostra/interpola waveform para um tamanho específico
 */
const resampleWaveform = (waveform: number[], targetSize: number): number[] => {
    if (waveform.length === 0) return [];
    if (waveform.length === targetSize) return waveform;

    const result: number[] = [];
    const ratio = waveform.length / targetSize;

    for (let i = 0; i < targetSize; i++) {
        const position = i * ratio;
        const index = Math.floor(position);
        const fraction = position - index;

        // Interpolação linear entre dois pontos
        if (index + 1 < waveform.length) {
            const value = waveform[index] * (1 - fraction) + waveform[index + 1] * fraction;
            result.push(value);
        } else {
            result.push(waveform[index]);
        }
    }

    return result;
};

/**
 * Gera hash code de uma string para usar como seed
 */
const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

/**
 * Gerador de número aleatório com seed
 */
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/**
 * Gera waveform aleatório baseado em seed (sempre o mesmo para o mesmo seed)
 * @param seed - String para gerar o seed (ex: voice.id)
 * @param size - Número de barras
 */
const generateSeededWaveform = (seed: string, size: number): number[] => {
    const baseSeed = hashCode(seed);
    const result: number[] = [];

    for (let i = 0; i < size; i++) {
        // Usa seed + índice para gerar valores diferentes mas determinísticos
        const value = seededRandom(baseSeed + i) * 60 + 20; // 20-80
        result.push(value);
    }

    return result;
};

/**
 * Componente de player de áudio para preview de vozes
 * - Botão play/pause
 * - Audiolines interativas que funcionam como visualizador e seek bar
 * - Número de barras responsivo baseado na largura do container
 * - Suporta waveform customizado ou gera aleatório
 * - Exibe mensagem quando sample não está disponível
 */
export function AudioPlayer({ voice, waveform, seekable = true, className = '' }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [numberOfBars, setNumberOfBars] = useState(40); // default

    // Context para controle global de playback
    const { isThisPlaying, play, pause } = useAudioPlayback(voice.id);

    const hasSample = Boolean(voice.sample_url);

    // Reset state quando voice muda
    useEffect(() => {
        setCurrentTime(0);
        setDuration(0);
        if (isThisPlaying) {
            pause();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voice.id]);

    // ResizeObserver com debounce para calcular número de barras dinamicamente
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let timeoutId: NodeJS.Timeout;

        const observer = new ResizeObserver(entries => {
            // Debounce: aguarda 150ms sem mudanças antes de recalcular
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const width = entries[0].contentRect.width;
                // 1 barra a cada 8px, mínimo 10, máximo 100
                const bars = Math.min(100, Math.max(10, Math.floor(width / 8)));
                setNumberOfBars(bars);
            }, 150);
        });

        observer.observe(container);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, []);

    // Audio event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            pause();
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
        // pause agora é estável (memoizado), mas incluído apenas por completude
    }, [pause]);

    // Sincronizar estado do audio com context
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !hasSample) return;

        if (isThisPlaying) {
            audio.play().catch((error) => {
                // Ignorar erros de autoplay ou políticas do browser
                console.warn('Failed to play audio:', error);
                pause();
            });
        } else {
            audio.pause();
        }
        // pause é estável (memoizado com useCallback)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isThisPlaying, hasSample]);

    // Gerar/processar waveform baseado em props e numberOfBars
    // OTIMIZADO: Usa seed baseado em voice.id para gerar sempre o mesmo waveform
    const audioLines = useMemo(() => {
        let baseWaveform: number[];

        if (waveform && waveform.length > 0) {
            // Normalizar waveform fornecido
            baseWaveform = normalizeWaveform(waveform);
        } else {
            // Gerar waveform com seed baseado em voice.id
            // Gera um waveform base maior para melhor interpolação
            baseWaveform = generateSeededWaveform(voice.id, Math.max(numberOfBars, 50));
        }

        // Interpolar para numberOfBars se necessário
        const finalWaveform = resampleWaveform(baseWaveform, numberOfBars);

        // Converter para array de objetos com height
        return finalWaveform.map(height => ({ height }));
    }, [waveform, voice.id, numberOfBars]);

    const togglePlayPause = () => {
        if (!hasSample) return;

        if (isThisPlaying) {
            pause();
        } else {
            play();
        }
    };

    const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!seekable) return;

        const audio = audioRef.current;
        const container = containerRef.current;
        if (!audio || !container || !hasSample || !duration) return;

        // Calcular posição do clique em relação ao container
        const rect = container.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));

        audio.currentTime = percentage * duration;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Audio element (invisível) */}
            {hasSample && (
                <audio ref={audioRef} src={voice.sample_url!} preload="metadata" />
            )}

            {/* Botão Play/Pause */}
            <Tooltip>
                <TooltipTrigger>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlayPause}
                        disabled={!hasSample}
                        className="h-8 w-8 p-0 flex-shrink-0 cursor-pointer"
                    >
                        {isThisPlaying ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {hasSample ? (isThisPlaying ? "Pausar prévia" : "Reproduzir prévia") : "Prévia indisponível"}
                </TooltipContent>
            </Tooltip>

            {/* Audiolines */}
            <div
                ref={containerRef}
                onClick={handleSeek}
                className={cn(
                    "flex items-center gap-1 flex-1 h-12 group",
                    seekable && hasSample ? "cursor-pointer hover:opacity-90" : ""
                )}
            >
                {hasSample ? (
                    audioLines.map((line, index) => {
                        const barProgress = ((index + 0.5) / audioLines.length) * 100;
                        const isActive = barProgress <= progress;

                        return (
                            <div
                                key={index}
                                className="flex-1 h-full flex items-center justify-center transition-opacity"
                            >
                                <div
                                    className={cn(
                                        "w-full rounded-full transition-all duration-150",
                                        isActive ? "bg-primary" : "bg-muted-foreground/30",
                                        isThisPlaying && "animate-pulse"
                                    )}
                                    style={{
                                        height: `${line.height}%`,
                                    }}
                                />
                            </div>
                        );
                    })
                ) : (
                    <span className="text-xs text-muted-foreground">
                        Preview indisponível
                    </span>
                )}
            </div>
        </div>
    );
}

