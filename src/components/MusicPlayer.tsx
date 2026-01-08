import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, SpeakerHigh, SpeakerSlash, YoutubeLogo } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const togglePlay = () => {
    if (!iframeRef.current) return

    if (isPlaying) {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
    } else {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!iframeRef.current) return
    
    if (isMuted) {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"unMute","args":""}', '*')
    } else {
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"mute","args":""}', '*')
    }
    setIsMuted(!isMuted)
  }

  const togglePlayerVisibility = () => {
    setShowPlayer(!showPlayer)
  }

  return (
    <>
      <iframe
        ref={iframeRef}
        className="fixed pointer-events-none opacity-0"
        width="0"
        height="0"
        src="https://www.youtube.com/embed/LaEgpNBt-bQ?enablejsapi=1&autoplay=0&loop=1&playlist=LaEgpNBt-bQ"
        allow="autoplay; encrypted-media"
        title="World is Mine - Hatsune Miku"
      />

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg" style={{ boxShadow: '0 0 30px oklch(0.65 0.15 195 / 0.2)' }}>
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
              <span className="text-xs font-bold text-primary">World is Mine</span>
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

            <Button
              size="sm"
              variant="ghost"
              onClick={togglePlayerVisibility}
              className="w-10 h-10 rounded-full bg-secondary/20 hover:bg-secondary/30 border border-secondary/40"
              title="Mostrar/Ocultar YouTube Player"
            >
              <YoutubeLogo size={20} weight="fill" className="text-secondary" />
            </Button>
          </div>

          <AnimatePresence>
            {showPlayer && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl"
                style={{ boxShadow: '0 0 40px oklch(0.65 0.15 195 / 0.3)' }}
              >
                <iframe
                  width="320"
                  height="180"
                  src="https://www.youtube.com/embed/LaEgpNBt-bQ?autoplay=0&loop=1&playlist=LaEgpNBt-bQ"
                  allow="autoplay; encrypted-media"
                  title="World is Mine - Hatsune Miku"
                  className="block"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}
