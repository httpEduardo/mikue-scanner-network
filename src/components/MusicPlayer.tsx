import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => console.log('Audio play error:', err))
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-4 left-4 z-50 flex gap-2 p-3 rounded-2xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
      style={{ boxShadow: '0 0 30px oklch(0.65 0.15 195 / 0.2)' }}
    >
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40"
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Pause size={20} weight="fill" className="text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Play size={20} weight="fill" className="text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-accent/20 hover:bg-accent/30 border border-accent/40"
        >
          <AnimatePresence mode="wait">
            {isMuted ? (
              <motion.div
                key="muted"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SpeakerSlash size={20} weight="fill" className="text-accent" />
              </motion.div>
            ) : (
              <motion.div
                key="unmuted"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SpeakerHigh size={20} weight="fill" className="text-accent" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-primary">Miku Miku Beam</span>
          <span className="text-[10px] text-muted-foreground">Hatsune Miku</span>
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
  )
}
