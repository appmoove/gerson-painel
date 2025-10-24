import { useEffect, useState } from 'react'

// Cache global para evitar reprocessamento
const waveformCache = new Map<string, number[]>()

/**
 * Hook para extrair waveform real de áudio usando Web Audio API
 * @param audioUrl URL do arquivo de áudio
 * @param sampleSize Número de samples para extrair (base para interpolação)
 * @returns { waveform, isLoading, error }
 */
export const useAudioWaveform = (
    audioUrl: string | null,
    sampleSize: number = 50
) => {
    const [waveform, setWaveform] = useState<number[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!audioUrl) {
            setWaveform(null)
            setIsLoading(false)
            setError(null)
            return
        }

        // Verificar cache primeiro
        if (waveformCache.has(audioUrl)) {
            setWaveform(waveformCache.get(audioUrl)!)
            setIsLoading(false)
            return
        }

        // Extrair waveform
        let isCancelled = false
        setIsLoading(true)
        setError(null)

        extractWaveform(audioUrl, sampleSize)
            .then((data) => {
                if (!isCancelled) {
                    waveformCache.set(audioUrl, data)
                    setWaveform(data)
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                if (!isCancelled) {
                    console.error('Erro ao extrair waveform:', err)
                    setError(err)
                    setIsLoading(false)
                }
            })

        return () => {
            isCancelled = true
        }
    }, [audioUrl, sampleSize])

    return { waveform, isLoading, error }
}

/**
 * Extrai waveform de um arquivo de áudio
 * @param url URL do arquivo de áudio
 * @param samples Número de samples desejados
 * @returns Array de amplitudes normalizadas
 */
async function extractWaveform(url: string, samples: number): Promise<number[]> {
    // 1. Fetch do áudio
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Falha ao carregar áudio: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()

    // 2. Criar AudioContext e decodificar
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const audioContext = new AudioContextClass()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    // 3. Pegar canal (mono ou primeiro canal de stereo)
    const rawData = audioBuffer.getChannelData(0)

    // 4. Amostrar para 'samples' pontos
    const blockSize = Math.floor(rawData.length / samples)
    const waveform: number[] = []

    for (let i = 0; i < samples; i++) {
        const start = i * blockSize
        let sum = 0

        // Calcular RMS (Root Mean Square) do bloco para amplitude média
        for (let j = 0; j < blockSize; j++) {
            const value = rawData[start + j]
            sum += value * value
        }

        // RMS: sqrt(média dos quadrados)
        const rms = Math.sqrt(sum / blockSize)
        waveform.push(rms)
    }

    // Fechar o contexto para liberar recursos
    audioContext.close()

    return waveform
}
