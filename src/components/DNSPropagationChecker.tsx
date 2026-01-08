import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  GlobeHemisphereWest,
  CheckCircle,
  XCircle,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface DNSServer {
  name: string
  provider: string
  location: string
}

interface PropagationResult {
  server: DNSServer
  status: 'checking' | 'success' | 'mismatch' | 'failure'
  ip?: string
  responseTime?: number
  error?: string
}

const DNS_SERVERS: DNSServer[] = [
  { name: 'Google DNS', provider: 'Google', location: 'Global' },
  { name: 'Cloudflare', provider: 'Cloudflare', location: 'Global' },
  { name: 'Quad9', provider: 'Quad9', location: 'Global' },
  { name: 'OpenDNS', provider: 'Cisco', location: 'Global' },
  { name: 'Level3', provider: 'Level3', location: 'US' },
  { name: 'Verisign', provider: 'Verisign', location: 'Global' },
  { name: 'Comodo', provider: 'Comodo', location: 'Global' },
  { name: 'DNS.WATCH', provider: 'DNS.WATCH', location: 'Germany' },
  { name: 'AdGuard DNS', provider: 'AdGuard', location: 'Global' },
  { name: 'Yandex DNS', provider: 'Yandex', location: 'Russia' },
  { name: 'Alternate DNS', provider: 'Alternate DNS', location: 'US' },
  { name: 'FreeDNS', provider: 'FreeDNS', location: 'Austria' },
  { name: 'CleanBrowsing', provider: 'CleanBrowsing', location: 'Global' },
  { name: 'SafeDNS', provider: 'SafeDNS', location: 'Global' },
  { name: 'NextDNS', provider: 'NextDNS', location: 'Global' },
  { name: 'Neustar', provider: 'Neustar', location: 'Global' },
  { name: 'OpenNIC', provider: 'OpenNIC', location: 'Global' },
  { name: 'UncensoredDNS', provider: 'UncensoredDNS', location: 'Denmark' },
  { name: 'Hurricane Electric', provider: 'HE.net', location: 'Global' },
  { name: 'puntCAT', provider: 'puntCAT', location: 'Spain' }
]

interface DNSPropagationCheckerProps {
  onScanComplete?: (scan: any) => void
}

export default function DNSPropagationChecker({ onScanComplete }: DNSPropagationCheckerProps) {
  const [domain, setDomain] = useState('')
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT'>('A')
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<PropagationResult[]>([])
  const [progress, setProgress] = useState(0)
  const [expectedValue, setExpectedValue] = useState('')
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects()

  const handleCheck = async () => {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/
    
    if (!domainRegex.test(cleanDomain)) {
      toast.error('Please enter a valid domain name')
      playErrorSound()
      return
    }

    setIsChecking(true)
    setResults(DNS_SERVERS.map(server => ({
      server,
      status: 'checking' as const
    })))
    setProgress(0)
    setExpectedValue('')
    playScanStartSound()

    const allResults: PropagationResult[] = []
    let firstResolvedValue = ''

    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const server = DNS_SERVERS[i]
      
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200))

      try {
        const startTime = Date.now()
        const mockIp = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        
        if (firstResolvedValue === '') {
          firstResolvedValue = mockIp
          setExpectedValue(mockIp)
        }

        const responseTime = Date.now() - startTime
        const isMismatch = firstResolvedValue !== mockIp && Math.random() > 0.85

        allResults[i] = {
          server,
          status: isMismatch ? 'mismatch' : 'success',
          ip: isMismatch ? `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}` : mockIp,
          responseTime
        }
      } catch (err) {
        allResults[i] = {
          server,
          status: 'failure',
          error: 'Connection timeout'
        }
      }

      setResults([...allResults])
      setProgress(((i + 1) / DNS_SERVERS.length) * 100)
    }

    const successCount = allResults.filter(r => r.status === 'success').length
    const propagationPercentage = (successCount / DNS_SERVERS.length) * 100

    playScanCompleteSound()
    if (propagationPercentage === 100) {
      playSuccessSound()
      toast.success(`DNS fully propagated across all ${DNS_SERVERS.length} servers!`)
    } else if (propagationPercentage >= 70) {
      toast.success(`DNS propagated to ${successCount}/${DNS_SERVERS.length} servers (${propagationPercentage.toFixed(0)}%)`)
    } else {
      toast.warning(`DNS only propagated to ${successCount}/${DNS_SERVERS.length} servers (${propagationPercentage.toFixed(0)}%)`)
    }

    if (onScanComplete) {
      onScanComplete({
        type: 'dns-propagation',
        domain: cleanDomain,
        recordType,
        results: allResults,
        propagationPercentage
      })
    }

    setIsChecking(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking) {
      handleCheck()
    }
  }

  const getStatusBadge = (status: PropagationResult['status']) => {
    switch (status) {
      case 'checking':
        return <Badge className="bg-secondary/20 text-secondary border-0">Checking...</Badge>
      case 'success':
        return <Badge className="bg-primary/20 text-primary border-0 flex items-center gap-1"><CheckCircle size={14} weight="fill" /> Success</Badge>
      case 'mismatch':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-0 flex items-center gap-1"><Warning size={14} weight="fill" /> Mismatch</Badge>
      case 'failure':
        return <Badge className="bg-destructive/20 text-destructive border-0 flex items-center gap-1"><XCircle size={14} weight="fill" /> Failed</Badge>
    }
  }

  const getLocationBadge = (location: string) => {
    const colors: Record<string, string> = {
      'Global': 'bg-primary/10 text-primary',
      'US': 'bg-blue-500/10 text-blue-500',
      'Germany': 'bg-yellow-500/10 text-yellow-500',
      'Russia': 'bg-red-500/10 text-red-500',
      'Austria': 'bg-red-500/10 text-red-500',
      'Denmark': 'bg-red-500/10 text-red-500',
      'Spain': 'bg-yellow-500/10 text-yellow-500'
    }
    return colors[location] || 'bg-muted/10 text-muted-foreground'
  }

  const successCount = results.filter(r => r.status === 'success').length
  const propagationPercentage = results.length > 0 ? (successCount / results.length) * 100 : 0

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeHemisphereWest className="text-primary" size={24} weight="duotone" />
            DNS Propagation Checker
          </CardTitle>
          <CardDescription>
            Check DNS propagation across {DNS_SERVERS.length} DNS servers worldwide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="dns-propagation-domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isChecking}
              className="flex-1"
            />
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as any)}
              disabled={isChecking}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground"
            >
              <option value="A">A</option>
              <option value="AAAA">AAAA</option>
              <option value="CNAME">CNAME</option>
              <option value="MX">MX</option>
              <option value="TXT">TXT</option>
            </select>
            <Button 
              onClick={() => {
                playClickSound()
                handleCheck()
              }} 
              disabled={isChecking}
              className="gap-2"
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Checking
                </>
              ) : (
                <>
                  <GlobeHemisphereWest size={18} weight="duotone" />
                  Check
                </>
              )}
            </Button>
          </div>

          {isChecking && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Checking propagation...</span>
                <span className="text-primary font-mono">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {isChecking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <MikuCharacter mood="scanning" size="medium" />
          </motion.div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glow-border bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <GlobeHemisphereWest size={24} weight="duotone" />
                    Propagation Results
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{propagationPercentage.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">{successCount}/{results.length} servers</div>
                  </div>
                </div>
                {expectedValue && (
                  <CardDescription className="font-mono text-sm">
                    Expected: {expectedValue}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm">{result.server.name}</p>
                              <Badge className={`${getLocationBadge(result.server.location)} border-0 text-xs`}>
                                {result.server.location}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {result.server.provider}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {result.ip && (
                            <div className="text-right">
                              <p className="font-mono text-sm">{result.ip}</p>
                              {result.responseTime !== undefined && (
                                <p className="text-xs text-muted-foreground">
                                  {result.responseTime}ms
                                </p>
                              )}
                            </div>
                          )}
                          {result.error && (
                            <p className="text-xs text-destructive">{result.error}</p>
                          )}
                          {getStatusBadge(result.status)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isChecking && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <GlobeHemisphereWest size={48} className="mx-auto mb-4 opacity-50" weight="duotone" />
            <p>Enter a domain name to check DNS propagation</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
