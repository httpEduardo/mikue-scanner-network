import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WaifuProps {
  name: string
  colors: {
    hair: string
    skin: string
    outfit: string
    accent: string
  }
  delay: number
}

const Waifu = ({ name, colors, delay }: WaifuProps) => {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 8)
    }, 150)
    return () => clearInterval(interval)
  }, [])

  const getBounce = () => {
    const pattern = [0, -3, -6, -8, -6, -3, 0, -2]
    return pattern[frame]
  }

  const getArmRotation = () => {
    const pattern = [0, 15, 25, 20, 10, 0, -10, -5]
    return pattern[frame]
  }

  const getHeadTilt = () => {
    const pattern = [0, 2, 4, 3, 1, -1, -2, -1]
    return pattern[frame]
  }

  const getLegOffset = () => {
    const pattern = [0, 1, 2, 2, 1, 0, -1, 0]
    return pattern[frame]
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', bounce: 0.5 }}
      className="relative"
      style={{ width: '100px', height: '130px' }}
    >
      <svg
        viewBox="0 0 120 150"
        className="w-full h-full drop-shadow-2xl"
        style={{ transform: `translateY(${getBounce()}px)` }}
      >
        <defs>
          <linearGradient id={`hair-${name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.hair, stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: colors.hair, stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: colors.hair, stopOpacity: 0.85 }} />
          </linearGradient>
          <linearGradient id={`hair-shine-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'oklch(0.98 0.02 0)', stopOpacity: 0.6 }} />
            <stop offset="50%" style={{ stopColor: 'oklch(0.95 0.02 0)', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: colors.hair, stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id={`skin-${name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.skin, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.skin, stopOpacity: 0.95 }} />
          </linearGradient>
          <radialGradient id={`blush-${name}`}>
            <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: colors.accent, stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id={`eye-shine-${name}`}>
            <stop offset="0%" style={{ stopColor: 'oklch(0.98 0 0)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.98 0 0)', stopOpacity: 0 }} />
          </radialGradient>
          <filter id={`glow-${name}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g style={{ transform: `rotate(${getHeadTilt()}deg)`, transformOrigin: '60px 45px' }}>
          <ellipse cx="60" cy="45" rx="24" ry="28" fill={`url(#skin-${name})`} />
          
          <path d="M 38 20 Q 35 15 38 10 Q 42 5 50 3 Q 58 1 68 3 Q 76 5 80 10 Q 83 15 82 22 Q 81 30 78 38 L 74 48" 
                fill={`url(#hair-${name})`} 
                stroke={colors.hair} 
                strokeWidth="0.5" />
          
          <ellipse cx="60" cy="20" rx="26" ry="22" fill={`url(#hair-${name})`} />
          
          <ellipse cx="36" cy="35" rx="12" ry="28" fill={`url(#hair-${name})`} />
          <ellipse cx="84" cy="35" rx="12" ry="28" fill={`url(#hair-${name})`} />
          
          <ellipse cx="48" cy="16" rx="10" ry="8" fill={`url(#hair-shine-${name})`} opacity="0.7" />
          
          <ellipse cx="50" cy="43" rx="7" ry="9" fill="oklch(0.98 0 0)" />
          <ellipse cx="70" cy="43" rx="7" ry="9" fill="oklch(0.98 0 0)" />
          
          <ellipse cx="50" cy="44" rx="5" ry="7" fill={colors.hair} opacity="0.8" />
          <ellipse cx="70" cy="44" rx="5" ry="7" fill={colors.hair} opacity="0.8" />

          <ellipse cx="51" cy="42" rx="2.5" ry="3" fill={`url(#eye-shine-${name})`} />
          <ellipse cx="71" cy="42" rx="2.5" ry="3" fill={`url(#eye-shine-${name})`} />
          
          <circle cx="51.5" cy="40.5" r="1.5" fill="oklch(0.98 0 0)" opacity="0.9" />
          <circle cx="71.5" cy="40.5" r="1.5" fill="oklch(0.98 0 0)" opacity="0.9" />

          <path d="M 44 38 Q 46 36 48 37" stroke="oklch(0.30 0.05 210)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M 72 37 Q 74 36 76 38" stroke="oklch(0.30 0.05 210)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />

          <ellipse cx="43" cy="48" rx="5" ry="4" fill={`url(#blush-${name})`} />
          <ellipse cx="77" cy="48" rx="5" ry="4" fill={`url(#blush-${name})`} />

          <path d="M 54 56 Q 60 59 66 56" stroke={colors.accent} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="60" cy="57" rx="3" ry="2" fill={colors.accent} opacity="0.2" />
          
          <line x1="58" y1="52" x2="58" y2="54" stroke={colors.skin} strokeWidth="1" opacity="0.3" />
        </g>

        <rect x="48" y="70" width="24" height="32" fill={colors.outfit} rx="5" 
              stroke="oklch(0.98 0 0)" strokeWidth="0.5" opacity="0.9" />
        
        <path d="M 52 72 L 68 72" stroke="oklch(0.98 0 0)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
        <circle cx="54" cy="78" r="1.5" fill="oklch(0.98 0 0)" opacity="0.6" />
        <circle cx="66" cy="78" r="1.5" fill="oklch(0.98 0 0)" opacity="0.6" />

        <g style={{ transform: `rotate(${getArmRotation()}deg)`, transformOrigin: '44px 75px' }}>
          <rect x="40" y="75" width="8" height="24" fill={`url(#skin-${name})`} rx="4" />
          <ellipse cx="44" cy="99" rx="4" ry="4.5" fill={`url(#skin-${name})`} />
        </g>
        <g style={{ transform: `rotate(${-getArmRotation()}deg)`, transformOrigin: '76px 75px' }}>
          <rect x="72" y="75" width="8" height="24" fill={`url(#skin-${name})`} rx="4" />
          <ellipse cx="76" cy="99" rx="4" ry="4.5" fill={`url(#skin-${name})`} />
        </g>

        <rect x="52" y="102" width="6" height="26" fill={`url(#skin-${name})`} rx="3" 
              style={{ transform: `translateX(${getLegOffset()}px)` }} />
        <rect x="62" y="102" width="6" height="26" fill={`url(#skin-${name})`} rx="3" 
              style={{ transform: `translateX(${-getLegOffset()}px)` }} />

        <ellipse cx="55" cy="128" rx="5" ry="3" fill={colors.outfit} />
        <ellipse cx="65" cy="128" rx="5" ry="3" fill={colors.outfit} />

        {name === 'Asuna' && (
          <>
            <rect x="57" y="15" width="6" height="12" fill="oklch(0.82 0.15 30)" rx="2" />
            <circle cx="60" cy="12" r="3.5" fill="oklch(0.70 0.20 340)" />
            <circle cx="60" cy="12" r="2" fill="oklch(0.90 0.05 350)" />
            <path d="M 53 72 L 60 82 L 67 72" stroke="oklch(0.90 0.05 350)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <rect x="58" y="84" width="4" height="6" fill="oklch(0.90 0.05 350)" rx="1" />
          </>
        )}

        {name === 'Rem' && (
          <>
            <rect x="53" y="72" width="14" height="5" fill="oklch(0.98 0 0)" rx="2.5" />
            <circle cx="48" cy="25" r="5" fill="oklch(0.98 0 0)" />
            <circle cx="72" cy="25" r="5" fill="oklch(0.98 0 0)" />
            <path d="M 45 25 Q 42 20 47 17" stroke="oklch(0.98 0 0)" strokeWidth="2.5" fill="none" />
            <path d="M 75 25 Q 78 20 73 17" stroke="oklch(0.98 0 0)" strokeWidth="2.5" fill="none" />
            <circle cx="48" cy="24" r="2" fill="oklch(0.60 0.18 250)" />
            <circle cx="72" cy="24" r="2" fill="oklch(0.60 0.18 250)" />
          </>
        )}

        {name === 'Zero Two' && (
          <>
            <path d="M 45 20 Q 42 13 47 10 L 50 16" stroke={colors.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 75 20 Q 78 13 73 10 L 70 16" stroke={colors.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="48" cy="11" r="2" fill="oklch(0.98 0 0)" />
            <circle cx="72" cy="11" r="2" fill="oklch(0.98 0 0)" />
            <rect x="54" y="74" width="12" height="3" fill="oklch(0.98 0 0)" opacity="0.5" rx="1.5" />
            <circle cx="60" cy="88" r="2" fill={colors.accent} opacity="0.7" />
          </>
        )}

        {name === 'Nezuko' && (
          <>
            <rect x="54" y="53" width="12" height="5" fill="oklch(0.75 0.15 20)" rx="2.5" />
            <path d="M 53 53 Q 49 52 48 55" stroke="oklch(0.75 0.15 20)" strokeWidth="2" fill="none" />
            <path d="M 67 53 Q 71 52 72 55" stroke="oklch(0.75 0.15 20)" strokeWidth="2" fill="none" />
            <rect x="56" y="86" width="8" height="12" fill="oklch(0.25 0.08 0)" rx="1" />
            <path d="M 57 88 L 60 92 L 57 96" stroke="oklch(0.75 0.15 20)" strokeWidth="1.2" fill="none" />
            <path d="M 63 88 L 60 92 L 63 96" stroke="oklch(0.75 0.15 20)" strokeWidth="1.2" fill="none" />
            <rect x="32" y="28" width="5" height="12" fill="oklch(0.75 0.15 20)" rx="2" opacity="0.8" />
            <rect x="83" y="28" width="5" height="12" fill="oklch(0.75 0.15 20)" rx="2" opacity="0.8" />
          </>
        )}
      </svg>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-bold text-primary whitespace-nowrap px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm border border-primary/50" style={{ textShadow: '0 0 8px oklch(0.15 0.02 250), 0 0 12px oklch(0.65 0.15 195 / 0.6)' }}>
        {name}
      </div>
    </motion.div>
  )
}

export default function DancingWaifus() {
  const waifus = [
    {
      name: 'Asuna',
      colors: {
        hair: 'oklch(0.72 0.12 40)',
        skin: 'oklch(0.94 0.02 40)',
        outfit: 'oklch(0.96 0.02 0)',
        accent: 'oklch(0.70 0.18 25)'
      }
    },
    {
      name: 'Rem',
      colors: {
        hair: 'oklch(0.62 0.20 250)',
        skin: 'oklch(0.94 0.02 40)',
        outfit: 'oklch(0.78 0.12 210)',
        accent: 'oklch(0.82 0.10 345)' 
      }
    },
    {
      name: 'Zero Two',
      colors: {
        hair: 'oklch(0.78 0.15 15)',
        skin: 'oklch(0.94 0.02 40)',
        outfit: 'oklch(0.68 0.16 10)',
        accent: 'oklch(0.72 0.18 345)'
      }
    },
    {
      name: 'Nezuko',
      colors: {
        hair: 'oklch(0.22 0.05 0)',
        skin: 'oklch(0.94 0.02 40)',
        outfit: 'oklch(0.72 0.14 25)',
        accent: 'oklch(0.80 0.10 350)'
      }
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      className="fixed bottom-6 left-6 z-30 flex gap-3 p-4 rounded-2xl bg-card/70 backdrop-blur-md border-2 border-primary/40 shadow-2xl"
      style={{ boxShadow: '0 0 50px oklch(0.65 0.15 195 / 0.3), 0 0 100px oklch(0.70 0.20 340 / 0.2)' }}
    >
      {waifus.map((waifu, index) => (
        <Waifu key={waifu.name} {...waifu} delay={index * 0.15} />
      ))}
    </motion.div>
  )
}
