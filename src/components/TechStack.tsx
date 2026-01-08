import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Code, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface TechStackProps {
  onScanComplete: (scan: any) => void
}

interface Technology {
  name: string
  category: string
  confidence: 'high' | 'medium' | 'low'
}

interface TechStackResult {
  domain: string
  technologies: Technology[]
}

export default function TechStack({ onScanComplete }: TechStackProps) {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TechStackResult | null>(null)
  const [error, setError] = useState('')
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects()

  const handleDetect = async () => {
    if (!domain) {
      setError('Please enter a domain name')
      playErrorSound()
      return
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/
    
    if (!domainRegex.test(cleanDomain)) {
      setError('Please enter a valid domain name (e.g., example.com)')
      playErrorSound()
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    playScanStartSound()

    try {
      const response = await fetch(`https://${cleanDomain}`, {
        method: 'GET',
        mode: 'cors'
      })

      const html = await response.text()
      const headers = response.headers

      const technologies: Technology[] = []

      if (html.includes('react') || html.includes('React')) {
        technologies.push({ name: 'React', category: 'JavaScript Framework', confidence: 'high' })
      }
      if (html.includes('vue') || html.includes('Vue')) {
        technologies.push({ name: 'Vue.js', category: 'JavaScript Framework', confidence: 'high' })
      }
      if (html.includes('angular') || html.includes('ng-')) {
        technologies.push({ name: 'Angular', category: 'JavaScript Framework', confidence: 'high' })
      }
      if (html.includes('next') || html.includes('Next')) {
        technologies.push({ name: 'Next.js', category: 'React Framework', confidence: 'medium' })
      }
      if (html.includes('nuxt')) {
        technologies.push({ name: 'Nuxt.js', category: 'Vue Framework', confidence: 'high' })
      }
      if (html.includes('gatsby')) {
        technologies.push({ name: 'Gatsby', category: 'Static Site Generator', confidence: 'high' })
      }
      if (html.includes('wordpress') || html.includes('wp-')) {
        technologies.push({ name: 'WordPress', category: 'CMS', confidence: 'high' })
      }
      if (html.includes('shopify')) {
        technologies.push({ name: 'Shopify', category: 'E-commerce', confidence: 'high' })
      }
      if (html.includes('jquery') || html.includes('jQuery')) {
        technologies.push({ name: 'jQuery', category: 'JavaScript Library', confidence: 'high' })
      }
      if (html.includes('bootstrap')) {
        technologies.push({ name: 'Bootstrap', category: 'CSS Framework', confidence: 'high' })
      }
      if (html.includes('tailwind')) {
        technologies.push({ name: 'Tailwind CSS', category: 'CSS Framework', confidence: 'high' })
      }
      if (html.includes('material-ui') || html.includes('mui')) {
        technologies.push({ name: 'Material-UI', category: 'UI Library', confidence: 'medium' })
      }

      const serverHeader = headers.get('server')
      if (serverHeader) {
        if (serverHeader.toLowerCase().includes('nginx')) {
          technologies.push({ name: 'Nginx', category: 'Web Server', confidence: 'high' })
        }
        if (serverHeader.toLowerCase().includes('apache')) {
          technologies.push({ name: 'Apache', category: 'Web Server', confidence: 'high' })
        }
        if (serverHeader.toLowerCase().includes('cloudflare')) {
          technologies.push({ name: 'Cloudflare', category: 'CDN', confidence: 'high' })
        }
      }

      const poweredBy = headers.get('x-powered-by')
      if (poweredBy) {
        if (poweredBy.toLowerCase().includes('php')) {
          technologies.push({ name: 'PHP', category: 'Backend Language', confidence: 'high' })
        }
        if (poweredBy.toLowerCase().includes('express')) {
          technologies.push({ name: 'Express', category: 'Backend Framework', confidence: 'high' })
        }
        if (poweredBy.toLowerCase().includes('asp.net')) {
          technologies.push({ name: 'ASP.NET', category: 'Backend Framework', confidence: 'high' })
        }
      }

      if (headers.get('x-vercel-id')) {
        technologies.push({ name: 'Vercel', category: 'Hosting', confidence: 'high' })
      }
      if (headers.get('x-amz-cf-id')) {
        technologies.push({ name: 'AWS CloudFront', category: 'CDN', confidence: 'high' })
      }
      if (headers.get('x-github-request-id')) {
        technologies.push({ name: 'GitHub Pages', category: 'Hosting', confidence: 'high' })
      }

      const techResult: TechStackResult = {
        domain: cleanDomain,
        technologies
      }

      setResult(techResult)
      onScanComplete({
        type: 'techstack',
        domain: cleanDomain,
        result: techResult
      })
      playScanCompleteSound()
      playSuccessSound()
      toast.success(`Detected ${technologies.length} technologies for ${cleanDomain}!`)
    } catch (err) {
      setError('Unable to detect technologies. The site may have CORS restrictions.')
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDetect()
    }
  }

  const getConfidenceColor = (confidence: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-primary/20 text-primary border-primary/30',
      'medium': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      'low': 'bg-muted/20 text-muted-foreground border-muted/30'
    }
    return colors[confidence] || colors['low']
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'JavaScript Framework': 'bg-yellow-500/20 text-yellow-500',
      'React Framework': 'bg-cyan-500/20 text-cyan-500',
      'Vue Framework': 'bg-green-500/20 text-green-500',
      'CSS Framework': 'bg-purple-500/20 text-purple-500',
      'UI Library': 'bg-pink-500/20 text-pink-500',
      'CMS': 'bg-blue-500/20 text-blue-500',
      'E-commerce': 'bg-green-500/20 text-green-500',
      'Web Server': 'bg-orange-500/20 text-orange-500',
      'CDN': 'bg-cyan-500/20 text-cyan-500',
      'Backend Language': 'bg-red-500/20 text-red-500',
      'Backend Framework': 'bg-red-500/20 text-red-500',
      'Hosting': 'bg-indigo-500/20 text-indigo-500',
      'JavaScript Library': 'bg-yellow-500/20 text-yellow-500',
      'Static Site Generator': 'bg-purple-500/20 text-purple-500'
    }
    return colors[category] || 'bg-muted/20 text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="text-primary" size={24} weight="duotone" />
            Technology Stack Detector
          </CardTitle>
          <CardDescription>
            Identify technologies, frameworks, and services used by a website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="tech-domain-input"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={() => {
                playClickSound()
                handleDetect()
              }} 
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Detecting
                </>
              ) : (
                <>
                  <Code size={18} weight="duotone" />
                  Detect
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <Warning size={18} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <MikuCharacter mood="scanning" size="medium" />
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="glow-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle size={24} weight="duotone" />
                  Technologies Detected
                </CardTitle>
                <CardDescription>
                  Found {result.technologies.length} technologies for {result.domain}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.technologies.length > 0 ? (
                  result.technologies.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{tech.name}</p>
                        <Badge className={`${getCategoryColor(tech.category)} border-0 mt-1`}>
                          {tech.category}
                        </Badge>
                      </div>
                      <Badge className={`${getConfidenceColor(tech.confidence)} px-3 border`}>
                        {tech.confidence} confidence
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <Alert>
                    <Warning size={18} />
                    <AlertDescription>
                      No technologies detected. The site may have CORS restrictions or use technologies not in our detection list.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <MikuCharacter mood="success" size="medium" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
