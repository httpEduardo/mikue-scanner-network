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
      setFrame((prev) => (prev + 1) % 4)
    }, 200)
    return () => clearInterval(interval)
  }, [])

  const getBounce = () => {
    switch (frame) {
      case 0:
        return 0
      case 1:
        return -8
      case 2:
        return 0
      case 3:
        return -4
      default:
        return 0
    }
  }

  const getArmRotation = () => {
    switch (frame) {
      case 0:
        return 0
      case 1:
        return 20
      case 2:
        return -10
      case 3:
        return 15
      default:
        return 0
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', bounce: 0.5 }}
      className="relative"
      style={{ width: '95px', height: '114px' }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-lg"
        style={{ transform: `translateY(${getBounce()}px)` }}
      >
        <defs>
          <linearGradient id={`hair-${name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.hair, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.hair, stopOpacity: 0.85 }} />
          </linearGradient>
          <linearGradient id={`hair-shine-${name}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="30%" style={{ stopColor: 'oklch(0.95 0 0)', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: colors.hair, stopOpacity: 0 }} />
          </linearGradient>
          <radialGradient id={`blush-${name}`}>
            <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: colors.accent, stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id={`eye-shine-${name}`}>
            <stop offset="0%" style={{ stopColor: 'oklch(0.98 0 0)', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: 'oklch(0.98 0 0)', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        <ellipse cx="50" cy="38" rx="19" ry="22" fill={colors.skin} />

        <ellipse cx="50" cy="20" rx="22" ry="20" fill={`url(#hair-${name})`} />
        <ellipse cx="32" cy="30" rx="10" ry="24" fill={`url(#hair-${name})`} />
        <ellipse cx="68" cy="30" rx="10" ry="24" fill={`url(#hair-${name})`} />
        <ellipse cx="45" cy="18" rx="8" ry="5" fill={`url(#hair-shine-${name})`} />

        <ellipse cx="42" cy="37" rx="5" ry="6" fill="oklch(0.98 0 0)" />
        <ellipse cx="58" cy="37" rx="5" ry="6" fill="oklch(0.98 0 0)" />
        
        <ellipse cx="42" cy="38" rx="3.5" ry="5" fill="oklch(0.25 0.08 210)" />
        <ellipse cx="58" cy="38" rx="3.5" ry="5" fill="oklch(0.25 0.08 210)" />

        <ellipse cx="43" cy="36" rx="2" ry="2.5" fill={`url(#eye-shine-${name})`} />
        <ellipse cx="59" cy="36" rx="2" ry="2.5" fill={`url(#eye-shine-${name})`} />
        
        <circle cx="43.5" cy="35" r="1.2" fill="oklch(0.98 0 0)" opacity="0.8" />
        <circle cx="59.5" cy="35" r="1.2" fill="oklch(0.98 0 0)" opacity="0.8" />

        <path d="M 38 32 Q 40 30 42 31" stroke="oklch(0.30 0.05 210)" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 58 31 Q 60 30 62 32" stroke="oklch(0.30 0.05 210)" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />

        <ellipse cx="38" cy="41" rx="4" ry="3.5" fill={`url(#blush-${name})`} />
        <ellipse cx="62" cy="41" rx="4" ry="3.5" fill={`url(#blush-${name})`} />

        <path d="M 46 46 Q 50 48.5 54 46" stroke={colors.accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="47" rx="2" ry="1.5" fill={colors.accent} opacity="0.3" />

        <rect x="38" y="55" width="24" height="28" fill={colors.outfit} rx="4" />
        <rect x="41" y="57" width="18" height="3" fill="oklch(0.98 0 0)" opacity="0.2" rx="1" />

        <g style={{ transform: `rotate(${getArmRotation()}deg)`, transformOrigin: '35px 60px' }}>
          <rect x="32" y="60" width="7" height="20" fill={colors.skin} rx="3.5" />
          <circle cx="35.5" cy="80" r="3.5" fill={colors.skin} />
        </g>
        <g style={{ transform: `rotate(${-getArmRotation()}deg)`, transformOrigin: '65px 60px' }}>
          <rect x="61" y="60" width="7" height="20" fill={colors.skin} rx="3.5" />
          <circle cx="64.5" cy="80" r="3.5" fill={colors.skin} />
        </g>

        <rect x="42" y="83" width="7" height="22" fill={colors.skin} rx="3.5" />
        <rect x="51" y="83" width="7" height="22" fill={colors.skin} rx="3.5" />

        <ellipse cx="45.5" cy="105" rx="5" ry="2.5" fill={colors.outfit} />
        <ellipse cx="54.5" cy="105" rx="5" ry="2.5" fill={colors.outfit} />

        {name === 'Asuna' && (
          <>
            <rect x="47" y="16" width="6" height="10" fill="oklch(0.82 0.15 30)" rx="2" />
            <circle cx="50" cy="14" r="3" fill="oklch(0.70 0.20 340)" />
            <circle cx="50" cy="14" r="1.5" fill="oklch(0.90 0.05 350)" />
            <path d="M 43 57 L 50 65 L 57 57" stroke="oklch(0.90 0.05 350)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        )}

        {name === 'Rem' && (
          <>
            <rect x="44" y="57" width="12" height="4" fill="oklch(0.98 0 0)" rx="2" />
            <circle cx="40" cy="22" r="4" fill="oklch(0.98 0 0)" />
            <circle cx="60" cy="22" r="4" fill="oklch(0.98 0 0)" />
            <path d="M 38 22 Q 36 18 40 16" stroke="oklch(0.98 0 0)" strokeWidth="2" fill="none" />
            <path d="M 62 22 Q 64 18 60 16" stroke="oklch(0.98 0 0)" strokeWidth="2" fill="none" />
          </>
        )}

        {name === 'Zero Two' && (
          <>
            <path d="M 38 18 Q 36 12 40 10 L 42 14" stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 62 18 Q 64 12 60 10 L 58 14" stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="41" cy="11" r="1.5" fill="oklch(0.98 0 0)" />
            <circle cx="59" cy="11" r="1.5" fill="oklch(0.98 0 0)" />
            <rect x="45" y="58" width="10" height="2" fill="oklch(0.98 0 0)" opacity="0.4" />
          </>
        )}

        {name === 'Nezuko' && (
          <>
            <rect x="45" cy="44" width="10" height="4" fill="oklch(0.75 0.15 20)" rx="2" />
            <path d="M 44 44 Q 41 43 40 46" stroke="oklch(0.75 0.15 20)" strokeWidth="1.5" fill="none" />
            <path d="M 56 44 Q 59 43 60 46" stroke="oklch(0.75 0.15 20)" strokeWidth="1.5" fill="none" />
            <rect x="46" y="70" width="8" height="10" fill="oklch(0.25 0.08 0)" rx="1" />
            <path d="M 47 71 L 49 76 L 47 81" stroke="oklch(0.75 0.15 20)" strokeWidth="1" fill="none" />
            <path d="M 53 71 L 51 76 L 53 81" stroke="oklch(0.75 0.15 20)" strokeWidth="1" fill="none" />
          </>
        )}
      </svg>

      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary whitespace-nowrap px-2 py-0.5 rounded-full bg-card/80 backdrop-blur-sm border border-primary/40" style={{ textShadow: '0 0 6px oklch(0.15 0.02 250), 0 0 10px oklch(0.65 0.15 195 / 0.5)' }}>
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
        hair: 'oklch(0.70 0.15 35)',
        skin: 'oklch(0.92 0.02 45)',
        outfit: 'oklch(0.95 0.02 0)',
        accent: 'oklch(0.70 0.20 25)'
      }
    },
    {
      name: 'Rem',
      colors: {
        hair: 'oklch(0.60 0.18 250)',
        skin: 'oklch(0.92 0.02 45)',
        outfit: 'oklch(0.75 0.12 200)',
        accent: 'oklch(0.85 0.10 340)' 
      }
    },
    {
      name: 'Zero Two',
      colors: {
        hair: 'oklch(0.75 0.18 10)',
        skin: 'oklch(0.92 0.02 45)',
        outfit: 'oklch(0.65 0.18 5)',
        accent: 'oklch(0.70 0.20 340)'
      }
    },
    {
      name: 'Nezuko',
      colors: {
        hair: 'oklch(0.25 0.08 0)',
        skin: 'oklch(0.92 0.02 45)',
        outfit: 'oklch(0.75 0.15 20)',
        accent: 'oklch(0.85 0.12 340)'
      }
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex gap-3 p-4 rounded-2xl bg-card/70 backdrop-blur-md border-2 border-primary/40 shadow-2xl"
      style={{ boxShadow: '0 0 50px oklch(0.65 0.15 195 / 0.3), 0 0 100px oklch(0.70 0.20 340 / 0.2)' }}
    >
      {waifus.map((waifu, index) => (
        <Waifu key={waifu.name} {...waifu} delay={index * 0.15} />
      ))}
    </motion.div>
  )
}
