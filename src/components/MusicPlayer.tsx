import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, SpeakerHigh, SpeakerSlash, MusicNotes, SpeakerLow, SpeakerNone } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useKV<number>('music-volume', 0.5)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showStartButton, setShowStartButton] = useState(true)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.src = 'https://ia801303.us.archive.org/33/items/hatsune-miku-world-is-mine/Hatsune%20Miku%20-%20World%20is%20Mine.mp3'
    audioRef.current.loop = true
    audioRef.current.volume = volume ?? 0.5
    
    audioRef.current.addEventListener('error', (e) => {
      console.error('Erro ao carregar áudio:', e)
      toast.error('Erro ao carregar música')
    })
    
    audioRef.current.addEventListener('canplaythrough', () => {
      console.log('Música carregada com sucesso')
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startMusic = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setShowStartButton(false)
        toast.success('🎵 World is Mine tocando!')
      } catch (error) {
        console.error('Erro ao tocar música:', error)
        setShowStartButton(true)
      }
    }
  }

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
        setShowStartButton(false)
      }
    } catch (error) {
      console.error('Erro ao tocar música:', error)
      toast.error('Erro ao tocar música. Clique no botão de play.')
      setShowStartButton(true)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0]
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const getVolumeIcon = () => {
    const vol = volume ?? 0.5
    if (isMuted || vol === 0) return SpeakerSlash
    if (vol < 0.3) return SpeakerNone
    if (vol < 0.7) return SpeakerLow
    return SpeakerHigh
  }

  const VolumeIcon = getVolumeIcon()

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : (volume ?? 0.5)
    }
  }, [volume, isMuted])

  return (
    <>
      {showStartButton && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]"
        >
          <Button
            size="lg"
            onClick={startMusic}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-2xl hover:scale-110 transition-transform"
            style={{ boxShadow: '0 0 60px oklch(0.65 0.15 195 / 0.6)' }}
          >
            <div className="flex flex-col items-center gap-2">
              <Play size={40} weight="fill" />
              <span className="text-xs font-bold">TOCAR MÚSICA</span>
            </div>
          </Button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 left-4 z-50"
      >
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg" style={{ boxShadow: '0 0 30px oklch(0.65 0.15 195 / 0.2)' }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40"
            title={isPlaying ? "Pausar" : "Tocar"}
          >
            {isPlaying ? (
              <Pause size={20} weight="fill" className="text-primary" />
            ) : (
              <Play size={20} weight="fill" className="text-primary" />
            )}
          </Button>

          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary/30 border border-secondary/40"
              title={isMuted ? "Ativar Som" : "Desativar Som"}
            >
              <VolumeIcon size={20} weight="fill" className="text-secondary" />
            </Button>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-xl bg-card/95 backdrop-blur-md border border-secondary/30 shadow-xl"
                  style={{ boxShadow: '0 0 20px oklch(0.75 0.10 210 / 0.3)' }}
                >
                  <div className="flex flex-col items-center gap-2 w-10">
                    <span className="text-xs font-bold text-secondary">{Math.round((volume ?? 0.5) * 100)}%</span>
                    <Slider
                      value={[volume ?? 0.5]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.01}
                      orientation="vertical"
                      className="h-24"
                    />
                    <SpeakerHigh size={16} className="text-muted-foreground" weight="duotone" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <MusicNotes size={20} weight="fill" className="text-accent" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary">World is Mine</span>
              <span className="text-[10px] text-muted-foreground">Hatsune Miku</span>
            </div>
          </div>

          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-1 items-end h-6"
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{
                    height: ['8px', '24px', '8px'],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  )
}
