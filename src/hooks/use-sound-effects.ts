import { useRef, useCallback } from 'react'

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playClickSound = useCallback(() => {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [getAudioContext])

  const playScanStartSound = useCallback(() => {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3)
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }, [getAudioContext])

  const playScanCompleteSound = useCallback(() => {
    const ctx = getAudioContext()
    
    const playNote = (frequency: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    playNote(523.25, ctx.currentTime, 0.15)
    playNote(659.25, ctx.currentTime + 0.15, 0.15)
    playNote(783.99, ctx.currentTime + 0.3, 0.25)
  }, [getAudioContext])

  const playErrorSound = useCallback(() => {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }, [getAudioContext])

  const playSuccessSound = useCallback(() => {
    const ctx = getAudioContext()
    
    const playChord = (frequencies: number[], startTime: number) => {
      frequencies.forEach(freq => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(freq, startTime)
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5)

        oscillator.start(startTime)
        oscillator.stop(startTime + 0.5)
      })
    }

    playChord([659.25, 830.61, 987.77], ctx.currentTime)
  }, [getAudioContext])

  return {
    playClickSound,
    playScanStartSound,
    playScanCompleteSound,
    playErrorSound,
    playSuccessSound
  }
}
