import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface AudioPlayerContextValue {
    currentPlayingId: string | null;
    play: (voiceId: string) => void;
    pause: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

interface AudioPlayerProviderProps {
    children: ReactNode;
}

/**
 * Provider para controle global de playback de áudio
 * Garante que apenas um áudio toque por vez
 */
export function AudioPlayerProvider({ children }: AudioPlayerProviderProps) {
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

    // Memoizar funções para evitar re-renders desnecessários
    const play = useCallback((voiceId: string) => {
        setCurrentPlayingId(voiceId);
    }, []);

    const pause = useCallback(() => {
        setCurrentPlayingId(null);
    }, []);

    const value = useMemo(
        () => ({ currentPlayingId, play, pause }),
        [currentPlayingId, play, pause]
    );

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
}

/**
 * Hook para controlar playback de áudio específico
 * @param voiceId - ID único da voz/áudio
 * @returns Estado e controles de playback
 */
export function useAudioPlayback(voiceId: string) {
    const context = useContext(AudioPlayerContext);

    if (!context) {
        throw new Error("useAudioPlayback must be used within AudioPlayerProvider");
    }

    const { currentPlayingId, play, pause } = context;
    const isThisPlaying = currentPlayingId === voiceId;

    const togglePlay = () => {
        if (isThisPlaying) {
            pause();
        } else {
            play(voiceId);
        }
    };

    return {
        currentPlayingId,
        isThisPlaying,
        play: () => play(voiceId),
        pause,
        togglePlay,
    };
}

