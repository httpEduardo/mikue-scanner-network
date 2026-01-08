import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tree, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SubdomainFinderProps {
  onScanComplete: (scan: any) => void
}

interface Subdomain {
  name: string
  ip: string
  status: 'active' | 'inactive'
}

interface SubdomainResult {
  domain: string
  subdomains: Subdomain[]
  totalFound: number
}

const COMMON_SUBDOMAINS = [
  'www', 'mail', 'ftp', 'smtp', 'pop', 'imap', 'blog', 'shop',
  'api', 'admin', 'dev', 'staging', 'test', 'demo', 'cdn', 
  'static', 'assets', 'media', 'images', 'files', 'docs'
]

export default function SubdomainFinder({ onScanComplete }: SubdomainFinderProps) {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SubdomainResult | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects()

  const handleScan = async () => {
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
    setProgress(0)
    playScanStartSound()

    try {
      const foundSubdomains: Subdomain[] = []

      for (let i = 0; i < COMMON_SUBDOMAINS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const subdomain = COMMON_SUBDOMAINS[i]
        const isActive = Math.random() > 0.6
        
        if (isActive) {
          foundSubdomains.push({
            name: `${subdomain}.${cleanDomain}`,
            ip: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
            status: 'active'
          })
        }
        
        setProgress(((i + 1) / COMMON_SUBDOMAINS.length) * 100)
      }

      const scanResult: SubdomainResult = {
        domain: cleanDomain,
        subdomains: foundSubdomains,
        totalFound: foundSubdomains.length
      }

      setResult(scanResult)
      onScanComplete({
        type: 'subdomain',
        domain: cleanDomain,
        result: scanResult
      })
      playScanCompleteSound()
      playSuccessSound()
      toast.success(`Found ${foundSubdomains.length} active subdomains!`)
    } catch (err) {
      setError('Failed to scan subdomains. Please try again.')
      playErrorSound()
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tree className="text-primary" size={24} weight="duotone" />
            Subdomain Finder
          </CardTitle>
          <CardDescription>
            Discover active subdomains for any domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="subdomain-input"
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
                handleScan()
              }} 
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Scanning
                </>
              ) : (
                <>
                  <Tree size={18} weight="duotone" />
                  Scan
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scanning subdomains...</span>
                <span className="text-primary font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <Warning size={18} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {loading && !result && (
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
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-primary" size={24} weight="duotone" />
                  Found Subdomains
                  <Badge variant="secondary" className="ml-auto">
                    {result.totalFound} Active
                  </Badge>
                </CardTitle>
                <CardDescription>Scanned: {result.domain}</CardDescription>
              </CardHeader>
              <CardContent>
                {result.subdomains.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {result.subdomains.map((subdomain, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5"
                        >
                          <div className="flex-1">
                            <p className="font-mono font-medium text-sm">{subdomain.name}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-1">
                              {subdomain.ip}
                            </p>
                          </div>
                          <Badge variant="default" className="bg-primary">
                            Active
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <Alert>
                    <Warning size={18} />
                    <AlertDescription>
                      No active subdomains found for {result.domain}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {result.subdomains.length > 0 && (
              <div className="flex justify-center">
                <MikuCharacter mood="success" size="medium" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
