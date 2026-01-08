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
            <stop offset="0%" style={{ stopColor: 'oklch(0.72 0.20 195)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'oklch(0.68 0.22 197)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.58 0.24 200)', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id={`mikuHairShine-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'oklch(0.95 0.02 0)', stopOpacity: 0.5 }} />
            <stop offset="50%" style={{ stopColor: 'oklch(0.90 0.02 0)', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.72 0.20 195)', stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id={`mikuSkin-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'oklch(0.96 0.015 50)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.91 0.025 45)', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id={`mikuOutfit-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'oklch(0.80 0.12 210)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.72 0.14 215)', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id={`mikuTie-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'oklch(0.38 0.08 210)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.28 0.10 215)', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id={`mikuBlush-${size}`}>
            <stop offset="0%" style={{ stopColor: 'oklch(0.75 0.15 20)', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.75 0.15 20)', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id={`eyeShine-${size}`}>
            <stop offset="0%" style={{ stopColor: 'oklch(0.98 0 0)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.98 0 0)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        
        <motion.g transform={`scale(${scale})`}>
          <ellipse cx="100" cy="90" rx="42" ry="52" fill={`url(#mikuSkin-${size})`} />
          
          <path 
            d="M 68 62 Q 58 42 62 27 Q 66 12 80 6 Q 92 2 100 2 Q 108 2 120 6 Q 134 12 138 27 Q 142 42 132 62 L 128 78 Q 124 88 115 94 L 100 100 L 85 94 Q 76 88 72 78 Z" 
            fill={`url(#mikuHair-${size})`}
            stroke="oklch(0.52 0.24 200)"
            strokeWidth="0.5"
          />
          
          <ellipse cx="90" cy="35" rx="16" ry="12" fill={`url(#mikuHairShine-${size})`} opacity="0.6" />
          
          <path 
            d="M 48 55 Q 40 60 36 70 Q 32 80 32 95 Q 32 110 35 125 L 38 140"
            stroke={`url(#mikuHair-${size})`}
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 152 55 Q 160 60 164 70 Q 168 80 168 95 Q 168 110 165 125 L 162 140"
            stroke={`url(#mikuHair-${size})`}
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
          />
          
          <ellipse cx="82" cy="88" rx="9" ry="12" fill="oklch(0.98 0 0)" />
          <ellipse cx="118" cy="88" rx="9" ry="12" fill="oklch(0.98 0 0)" />
          
          <ellipse cx="82" cy="90" rx="6" ry="9" fill="oklch(0.65 0.20 195)" opacity="0.9" />
          <ellipse cx="118" cy="90" rx="6" ry="9" fill="oklch(0.65 0.20 195)" opacity="0.9" />
          
          <motion.ellipse 
            cx="82" cy="88" rx="3.5" ry="5" 
            fill="oklch(0.20 0.05 210)"
            animate={eyeAnimation}
          />
          <motion.ellipse 
            cx="118" cy="88" rx="3.5" ry="5" 
            fill="oklch(0.20 0.05 210)"
            animate={eyeAnimation}
          />
          
          <ellipse cx="83" cy="85" rx="2" ry="3" fill={`url(#eyeShine-${size})`} />
          <ellipse cx="119" cy="85" rx="2" ry="3" fill={`url(#eyeShine-${size})`} />
          
          <circle cx="83" cy="83" r="1.2" fill="oklch(0.98 0 0)" />
          <circle cx="119" cy="83" r="1.2" fill="oklch(0.98 0 0)" />
          
          <path d="M 74 80 Q 76 78 79 79" stroke="oklch(0.30 0.05 210)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M 121 79 Q 124 78 126 80" stroke="oklch(0.30 0.05 210)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
          
          <ellipse cx="70" cy="98" rx="9" ry="7" fill={`url(#mikuBlush-${size})`} />
          <ellipse cx="130" cy="98" rx="9" ry="7" fill={`url(#mikuBlush-${size})`} />
          
          {mood === 'happy' && (
            <>
              <path d="M 88 108 Q 100 114 112 108" stroke="oklch(0.70 0.20 340)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <ellipse cx="100" cy="111" rx="4" ry="3" fill="oklch(0.70 0.20 340)" opacity="0.3" />
            </>
          )}
          {mood === 'scanning' && (
            <ellipse cx="100" cy="110" rx="3" ry="2" fill="oklch(0.70 0.20 340)" />
          )}
          {mood === 'success' && (
            <>
              <path d="M 86 108 Q 100 116 114 108" stroke="oklch(0.70 0.20 340)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <ellipse cx="100" cy="112" rx="5" ry="3.5" fill="oklch(0.70 0.20 340)" opacity="0.3" />
            </>
          )}
          {mood === 'error' && (
            <path d="M 88 112 Q 100 108 112 112" stroke="oklch(0.70 0.20 340)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          
          <line x1="98" y1="104" x2="98" y2="107" stroke={`url(#mikuSkin-${size})`} strokeWidth="1.5" opacity="0.4" />
          
          <rect x="74" y="120" width="52" height="65" fill={`url(#mikuOutfit-${size})`} rx="6" 
                stroke="oklch(0.98 0 0)" strokeWidth="0.8" opacity="0.95" />
          
          <path d="M 78 122 L 122 122" stroke="oklch(0.98 0 0)" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
          <rect x="82" y="128" width="14" height="9" fill="oklch(0.30 0.05 210)" rx="2" />
          <rect x="104" y="128" width="14" height="9" fill="oklch(0.30 0.05 210)" rx="2" />
          
          <path d="M 100 140 L 92 165 L 100 180 L 108 165 Z" fill={`url(#mikuTie-${size})`} 
                stroke="oklch(0.20 0.05 210)" strokeWidth="0.5" />
          <circle cx="100" cy="142" r="3" fill="oklch(0.98 0 0)" opacity="0.4" />
          
          <line x1="90" y1="150" x2="88" y2="155" stroke="oklch(0.98 0 0)" strokeWidth="1" opacity="0.3" />
          <line x1="110" y1="150" x2="112" y2="155" stroke="oklch(0.98 0 0)" strokeWidth="1" opacity="0.3" />
          
          <path 
            d="M 74 145 L 66 170 Q 63 185 67 200 L 72 220 L 68 240 Q 67 252 70 265"
            stroke="oklch(0.30 0.05 210)"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 126 145 L 134 170 Q 137 185 133 200 L 128 220 L 132 240 Q 133 252 130 265"
            stroke="oklch(0.30 0.05 210)"
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
          />
          
          <ellipse cx="69" cy="230" rx="6" ry="4" fill="oklch(0.98 0 0)" opacity="0.3" />
          <ellipse cx="131" cy="230" rx="6" ry="4" fill="oklch(0.98 0 0)" opacity="0.3" />
          
          <circle cx="60" cy="48" r="10" fill="oklch(0.70 0.22 340)" opacity="0.7" />
          <circle cx="140" cy="48" r="10" fill="oklch(0.70 0.22 340)" opacity="0.7" />
          <circle cx="80" cy="32" r="6" fill="oklch(0.70 0.22 340)" opacity="0.5" />
          <circle cx="120" cy="32" r="6" fill="oklch(0.70 0.22 340)" opacity="0.5" />
          
          <path 
            d="M 60 30 Q 55 24 60 20 Q 64 18 68 22"
            stroke={`url(#mikuHair-${size})`}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 140 30 Q 145 24 140 20 Q 136 18 132 22"
            stroke={`url(#mikuHair-${size})`}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          
          {mood === 'scanning' && (
            <>
              <motion.circle 
                cx="100" cy="60" r="28" 
                fill="none" 
                stroke="oklch(0.65 0.15 195)" 
                strokeWidth="1.5"
                strokeDasharray="4 4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '100px 60px' }}
              />
              <motion.circle 
                cx="100" cy="60" r="35" 
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
                cx="75" cy="42" r="3" 
                fill="oklch(0.65 0.15 195)"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: 2, delay: 0 }}
              />
              <motion.circle 
                cx="125" cy="42" r="3" 
                fill="oklch(0.70 0.20 340)"
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: 2, delay: 0.3 }}
              />
              <motion.circle 
                cx="100" cy="28" r="3" 
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
