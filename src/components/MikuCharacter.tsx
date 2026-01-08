import { motion } from 'framer-motion'

interface MikuCharacterProps {
  mood?: 'happy' | 'scanning' | 'success' | 'error'
  size?: 'small' | 'medium' | 'large'
}

export default function MikuCharacter({ mood = 'happy', size = 'medium' }: MikuCharacterProps) {
  const dimensions = {
    small: { width: 80, height: 100, scale: 0.4 },
    medium: { width: 160, height: 200, scale: 0.8 },
    large: { width: 240, height: 300, scale: 1.2 }
  }

  const messages = {
    happy: 'Ready to scan!',
    scanning: 'Scanning networks...',
    success: 'Scan complete!',
    error: 'Connection failed!'
  }

  const { width, height, scale } = dimensions[size]

  const eyeAnimation = mood === 'scanning' ? {
    scaleY: [1, 0.2, 1],
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 2 }
  } : {}

  const headAnimation = mood === 'success' ? {
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.5, repeat: 2 }
  } : {}

  return (
    <motion.div 
      className="flex flex-col items-center gap-2"
      animate={mood === 'scanning' ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 2, repeat: mood === 'scanning' ? Infinity : 0 }}
    >
      <motion.svg 
        width={width} 
        height={height} 
        viewBox="0 0 200 250" 
        className="filter drop-shadow-lg"
        animate={headAnimation}
      >
        <defs>
          <linearGradient id={`mikuHair-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'oklch(0.70 0.18 195)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.60 0.20 200)', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id={`mikuSkin-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'oklch(0.95 0.02 50)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.90 0.03 45)', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id={`mikuBlush-${size}`}>
            <stop offset="0%" style={{ stopColor: 'oklch(0.75 0.15 20)', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.75 0.15 20)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        
        <motion.g transform={`scale(${scale})`}>
          <ellipse cx="100" cy="90" rx="40" ry="50" fill={`url(#mikuSkin-${size})`} />
          
          <path 
            d="M 70 60 Q 60 40 65 25 Q 70 10 85 5 Q 100 0 115 5 Q 130 10 135 25 Q 140 40 130 60 L 125 80 Q 120 90 110 95 L 100 100 L 90 95 Q 80 90 75 80 Z" 
            fill={`url(#mikuHair-${size})`}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
          />
          
          <ellipse cx="50" cy="70" rx="12" ry="45" fill={`url(#mikuHair-${size})`} transform="rotate(-15 50 70)" />
          <ellipse cx="150" cy="70" rx="12" ry="45" fill={`url(#mikuHair-${size})`} transform="rotate(15 150 70)" />
          
          <motion.ellipse 
            cx="85" cy="90" rx="4" ry="7" 
            fill="oklch(0.20 0.05 210)"
            animate={eyeAnimation}
          />
          <motion.ellipse 
            cx="115" cy="90" rx="4" ry="7" 
            fill="oklch(0.20 0.05 210)"
            animate={eyeAnimation}
          />
          
          <ellipse cx="75" cy="95" rx="8" ry="6" fill={`url(#mikuBlush-${size})`} />
          <ellipse cx="125" cy="95" rx="8" ry="6" fill={`url(#mikuBlush-${size})`} />
          
          {mood === 'happy' && (
            <path d="M 90 105 Q 100 110 110 105" stroke="oklch(0.70 0.20 340)" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          {mood === 'scanning' && (
            <ellipse cx="100" cy="107" rx="3" ry="2" fill="oklch(0.70 0.20 340)" />
          )}
          {mood === 'success' && (
            <path d="M 88 105 Q 100 112 112 105" stroke="oklch(0.70 0.20 340)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {mood === 'error' && (
            <path d="M 90 108 Q 100 105 110 108" stroke="oklch(0.70 0.20 340)" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
          
          <rect x="75" y="120" width="50" height="60" fill="oklch(0.75 0.10 210)" rx="5" />
          
          <rect x="80" y="125" width="18" height="8" fill="oklch(0.30 0.05 210)" rx="2" />
          <rect x="102" y="125" width="18" height="8" fill="oklch(0.30 0.05 210)" rx="2" />
          
          <path d="M 75 140 L 70 180 Q 68 190 72 200 L 75 220" stroke="oklch(0.30 0.05 210)" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M 125 140 L 130 180 Q 132 190 128 200 L 125 220" stroke="oklch(0.30 0.05 210)" strokeWidth="12" fill="none" strokeLinecap="round" />
          
          <circle cx="70" cy="50" r="8" fill="oklch(0.70 0.20 340)" opacity="0.6" />
          <circle cx="130" cy="50" r="8" fill="oklch(0.70 0.20 340)" opacity="0.6" />
          
          {mood === 'scanning' && (
            <>
              <motion.circle 
                cx="100" cy="60" r="25" 
                fill="none" 
                stroke="oklch(0.65 0.15 195)" 
                strokeWidth="1.5"
                strokeDasharray="4 4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '100px 60px' }}
              />
              <motion.circle 
                cx="100" cy="60" r="30" 
                fill="none" 
                stroke="oklch(0.70 0.20 340)" 
                strokeWidth="1"
                strokeDasharray="6 6"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '100px 60px' }}
              />
            </>
          )}
          
          {mood === 'success' && (
            <>
              <motion.circle 
                cx="80" cy="45" r="3" 
                fill="oklch(0.65 0.15 195)"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: 2, delay: 0 }}
              />
              <motion.circle 
                cx="120" cy="45" r="3" 
                fill="oklch(0.70 0.20 340)"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: 2, delay: 0.3 }}
              />
              <motion.circle 
                cx="100" cy="35" r="3" 
                fill="oklch(0.75 0.10 210)"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: 2, delay: 0.6 }}
              />
            </>
          )}
        </motion.g>
      </motion.svg>
      
      {size !== 'small' && (
        <motion.p 
          className="text-xs text-primary font-medium glow-text text-center px-4"
          animate={mood === 'scanning' ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 1.5, repeat: mood === 'scanning' ? Infinity : 0 }}
        >
          {messages[mood]}
        </motion.p>
      )}
    </motion.div>
  )
}
