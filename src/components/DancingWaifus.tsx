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
      style={{ width: '100px', height: '100px' }}
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full"
        style={{ transform: `translateY(${getBounce()}px)` }}
      >
        <defs>
          <linearGradient id={`hair-${name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.hair, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.hair, stopOpacity: 0.8 }} />
          </linearGradient>
          <radialGradient id={`blush-${name}`}>
            <stop offset="0%" style={{ stopColor: colors.accent, stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: colors.accent, stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        <ellipse cx="50" cy="35" rx="18" ry="20" fill={colors.skin} />

        <ellipse cx="50" cy="22" rx="20" ry="18" fill={`url(#hair-${name})`} />
        <ellipse cx="35" cy="28" rx="8" ry="20" fill={`url(#hair-${name})`} />
        <ellipse cx="65" cy="28" rx="8" ry="20" fill={`url(#hair-${name})`} />

        <circle cx="44" cy="35" r="2" fill="oklch(0.20 0.05 210)" />
        <circle cx="56" cy="35" r="2" fill="oklch(0.20 0.05 210)" />

        <circle cx="44.5" cy="34" r="0.8" fill="oklch(0.95 0 0)" opacity="0.7" />
        <circle cx="56.5" cy="34" r="0.8" fill="oklch(0.95 0 0)" opacity="0.7" />

        <ellipse cx="40" cy="38" rx="3" ry="2.5" fill={`url(#blush-${name})`} />
        <ellipse cx="60" cy="38" rx="3" ry="2.5" fill={`url(#blush-${name})`} />

        <path d="M 46 42 Q 50 44 54 42" stroke={colors.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" />

        <rect x="40" y="50" width="20" height="25" fill={colors.outfit} rx="3" />

        <g style={{ transform: `rotate(${getArmRotation()}deg)`, transformOrigin: '38px 55px' }}>
          <rect x="35" y="55" width="6" height="18" fill={colors.skin} rx="3" />
        </g>
        <g style={{ transform: `rotate(${-getArmRotation()}deg)`, transformOrigin: '62px 55px' }}>
          <rect x="59" y="55" width="6" height="18" fill={colors.skin} rx="3" />
        </g>

        <rect x="43" y="75" width="6" height="20" fill={colors.skin} rx="3" />
        <rect x="51" y="75" width="6" height="20" fill={colors.skin} rx="3" />

        <ellipse cx="46" cy="95" rx="4" ry="2" fill={colors.outfit} />
        <ellipse cx="54" cy="95" rx="4" ry="2" fill={colors.outfit} />

        {name === 'Asuna' && (
          <>
            <rect x="48" y="18" width="4" height="8" fill="oklch(0.80 0.15 30)" rx="1" />
            <circle cx="50" cy="16" r="2" fill="oklch(0.70 0.20 340)" />
          </>
        )}

        {name === 'Rem' && (
          <>
            <rect x="45" y="52" width="10" height="3" fill="oklch(0.95 0 0)" rx="1" />
            <rect x="47" y="20" width="6" height="4" fill="oklch(0.95 0 0)" rx="1" />
          </>
        )}

        {name === 'Zero Two' && (
          <>
            <path d="M 40 20 Q 38 15 42 14" stroke={colors.accent} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 60 20 Q 62 15 58 14" stroke={colors.accent} strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}

        {name === 'Nezuko' && (
          <>
            <rect x="46" y="40" width="8" height="3" fill="oklch(0.75 0.15 20)" rx="1" />
          </>
        )}
      </svg>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-primary whitespace-nowrap" style={{ textShadow: '0 0 4px oklch(0.15 0.02 250)' }}>
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed bottom-4 right-4 z-50 flex gap-2 p-3 rounded-2xl bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg"
      style={{ boxShadow: '0 0 30px oklch(0.65 0.15 195 / 0.2)' }}
    >
      {waifus.map((waifu, index) => (
        <Waifu key={waifu.name} {...waifu} delay={index * 0.15} />
      ))}
    </motion.div>
  )
}
