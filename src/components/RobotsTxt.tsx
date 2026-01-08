import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Robot, CheckCircle, Warning, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RobotsTxtProps {
  onScanComplete: (scan: any) => void
}

interface RobotsResult {
  domain: string
  exists: boolean
  content?: string
  sitemaps?: string[]
  disallowedPaths?: string[]
  allowedPaths?: string[]
}

export default function RobotsTxt({ onScanComplete }: RobotsTxtProps) {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RobotsResult | null>(null)
  const [error, setError] = useState('')
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects()

  const handleCheck = async () => {
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
      const response = await fetch(`https://${cleanDomain}/robots.txt`, {
        method: 'GET',
        mode: 'cors'
      })

      if (response.ok) {
        const content = await response.text()
        
        const sitemaps: string[] = []
        const disallowedPaths: string[] = []
        const allowedPaths: string[] = []

        content.split('\n').forEach(line => {
          const trimmedLine = line.trim()
          if (trimmedLine.toLowerCase().startsWith('sitemap:')) {
            sitemaps.push(trimmedLine.substring(8).trim())
          } else if (trimmedLine.toLowerCase().startsWith('disallow:')) {
            const path = trimmedLine.substring(9).trim()
            if (path) disallowedPaths.push(path)
          } else if (trimmedLine.toLowerCase().startsWith('allow:')) {
            const path = trimmedLine.substring(6).trim()
            if (path) allowedPaths.push(path)
          }
        })

        const robotsResult: RobotsResult = {
          domain: cleanDomain,
          exists: true,
          content,
          sitemaps,
          disallowedPaths,
          allowedPaths
        }

        setResult(robotsResult)
        onScanComplete({
          type: 'robots',
          domain: cleanDomain,
          result: robotsResult
        })
        playScanCompleteSound()
        playSuccessSound()
        toast.success(`Found robots.txt for ${cleanDomain}!`)
      } else {
        const robotsResult: RobotsResult = {
          domain: cleanDomain,
          exists: false
        }
        setResult(robotsResult)
        onScanComplete({
          type: 'robots',
          domain: cleanDomain,
          result: robotsResult
        })
        playScanCompleteSound()
        toast.info(`No robots.txt found for ${cleanDomain}`)
      }
    } catch (err) {
      const robotsResult: RobotsResult = {
        domain: cleanDomain,
        exists: false
      }
      setResult(robotsResult)
      onScanComplete({
        type: 'robots',
        domain: cleanDomain,
        result: robotsResult
      })
      playScanCompleteSound()
      toast.info(`Unable to access robots.txt for ${cleanDomain}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Robot className="text-primary" size={24} weight="duotone" />
            Robots.txt Analyzer
          </CardTitle>
          <CardDescription>
            Check robots.txt file for crawling rules and sitemap locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="robots-domain-input"
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
                handleCheck()
              }} 
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Checking
                </>
              ) : (
                <>
                  <Robot size={18} weight="duotone" />
                  Check
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
            {result.exists ? (
              <>
                <Card className="glow-border bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <CheckCircle size={24} weight="duotone" />
                      Robots.txt Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.sitemaps && result.sitemaps.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sitemaps</p>
                        <div className="space-y-2">
                          {result.sitemaps.map((sitemap, index) => (
                            <div key={index} className="p-2 rounded bg-primary/10 border border-primary/30">
                              <p className="font-mono text-sm break-all text-primary">{sitemap}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.disallowedPaths && result.disallowedPaths.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Disallowed Paths ({result.disallowedPaths.length})</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {result.disallowedPaths.slice(0, 10).map((path, index) => (
                            <div key={index} className="p-2 rounded bg-destructive/10 border border-destructive/30">
                              <p className="font-mono text-sm">{path}</p>
                            </div>
                          ))}
                          {result.disallowedPaths.length > 10 && (
                            <p className="text-xs text-muted-foreground italic">
                              + {result.disallowedPaths.length - 10} more paths
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {result.allowedPaths && result.allowedPaths.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Allowed Paths</p>
                        <div className="space-y-1">
                          {result.allowedPaths.map((path, index) => (
                            <div key={index} className="p-2 rounded bg-green-500/10 border border-green-500/30">
                              <p className="font-mono text-sm">{path}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.content && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Full Content</p>
                        <ScrollArea className="h-64 w-full rounded border border-border/50 bg-muted/30">
                          <pre className="p-4 text-xs font-mono whitespace-pre-wrap">{result.content}</pre>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="glow-border bg-card/50 backdrop-blur border-muted">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <XCircle size={24} weight="duotone" />
                    No Robots.txt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <Robot size={18} />
                    <AlertDescription>
                      No robots.txt file found for {result.domain}. This means the site has no explicit crawling restrictions.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-center">
              <MikuCharacter mood={result.exists ? "success" : "happy"} size="medium" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
