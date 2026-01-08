import { motion } from 'framer-motion'

interface MikuCharacterProps {
  mood?: 'happy' | 'scanning' | 'success' | 'error'
  size?: 'small' | 'medium' | 'large'
}

export default function MikuCharacter({ mood = 'happy', size = 'medium' }: MikuCharacterProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  }

  const emojis = {
    happy: '🎵',
    scanning: '🔍',
    success: '✨',
    error: '💫'
  }

  const messages = {
    happy: 'Ready to scan!',
    scanning: 'Scanning...',
    success: 'Success!',
    error: 'Oops!'
  }

  return (
    <motion.div 
      className="flex flex-col items-center gap-2"
      animate={mood === 'scanning' ? { scale: [1, 1.05, 1] } : mood === 'success' ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 0.5, repeat: mood === 'scanning' ? Infinity : 0 }}
    >
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl animate-float glow-border`}>
        {emojis[mood]}
      </div>
      {size !== 'small' && (
        <p className="text-xs text-muted-foreground font-medium">{messages[mood]}</p>
      )}
    </motion.div>
  )
}
