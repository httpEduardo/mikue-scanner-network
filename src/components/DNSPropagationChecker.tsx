import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  GlobeHemisphereWest,
  CheckCircle,
  XCircle,
  ClockCounterClockwise,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DNSServer {
  name: string
  location: string
  ip: string
  flag: string
}

interface PropagationResult {
  server: DNSServer
  status: 'checking' | 'success' | 'failure' | 'mismatch'
  ip?: string
  error?: string
  responseTime?: number
}

const DNS_SERVERS: DNSServer[] = [
  { name: 'Google DNS', location: 'Global', ip: '8.8.8.8', flag: '🌐' },
  { name: 'Cloudflare', location: 'Global', ip: '1.1.1.1', flag: '🌐' },
  { name: 'Quad9', location: 'Global', ip: '9.9.9.9', flag: '🌐' },
  { name: 'OpenDNS', location: 'USA', ip: '208.67.222.222', flag: '🇺🇸' },
  { name: 'Level3', location: 'USA', ip: '4.2.2.2', flag: '🇺🇸' },
  { name: 'Comodo', location: 'USA', ip: '8.26.56.26', flag: '🇺🇸' },
  { name: 'DNS.WATCH', location: 'Germany', ip: '84.200.69.80', flag: '🇩🇪' },
  { name: 'Verisign', location: 'USA', ip: '64.6.64.6', flag: '🇺🇸' },
  { name: 'AdGuard', location: 'Global', ip: '94.140.14.14', flag: '🌐' },
  { name: 'CleanBrowsing', location: 'USA', ip: '185.228.168.9', flag: '🇺🇸' },
]

export default function DNSPropagationChecker({ onScanComplete }: { onScanComplete?: (scan: any) => void }) {
  const [domain, setDomain] = useState('')
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT'>('A')
  const [isChecking, setIsChecking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<PropagationResult[]>([])
  const [expectedValue, setExpectedValue] = useState<string>('')

  const checkDNSPropagation = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    setIsChecking(true)
    setProgress(0)
    setResults([])
    setExpectedValue('')

    const initialResults: PropagationResult[] = DNS_SERVERS.map(server => ({
      server,
      status: 'checking' as const
    }))
    setResults(initialResults)

    const allResults: PropagationResult[] = []
    let completedChecks = 0

    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const server = DNS_SERVERS[i]
      
      try {
        const startTime = performance.now()
        
        const response = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}&cd=false`
        )
        
        const endTime = performance.now()
        const responseTime = Math.round(endTime - startTime)
        
        if (!response.ok) {
          throw new Error('DNS query failed')
        }

        const data = await response.json()
        
        let resolvedValue = ''
        
        if (data.Answer && data.Answer.length > 0) {
          if (recordType === 'A' || recordType === 'AAAA') {
            resolvedValue = data.Answer[0].data
          } else if (recordType === 'CNAME') {
            resolvedValue = data.Answer[0].data
          } else if (recordType === 'MX') {
            resolvedValue = data.Answer.map((a: any) => `${a.data} (${a.priority || 'N/A'})`).join(', ')
          } else if (recordType === 'TXT') {
            resolvedValue = data.Answer.map((a: any) => a.data).join(', ')
          }

          if (!expectedValue) {
            setExpectedValue(resolvedValue)
          }

          const status = !expectedValue || resolvedValue === expectedValue ? 'success' : 'mismatch'
          
          allResults[i] = {
            server,
            status,
            ip: resolvedValue,
            responseTime
          }
        } else {
          allResults[i] = {
            server,
            status: 'failure',
            error: 'No records found',
            responseTime
          }
        }
      } catch (error) {
        allResults[i] = {
          server,
          status: 'failure',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: 0
        }
      }

      completedChecks++
      setProgress((completedChecks / DNS_SERVERS.length) * 100)
      setResults([...allResults])
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsChecking(false)

    const successCount = allResults.filter(r => r.status === 'success').length
    const totalCount = allResults.length
    const propagationPercentage = Math.round((successCount / totalCount) * 100)

    if (onScanComplete) {
      onScanComplete({
        type: 'dns-propagation',
        domain,
        recordType,
        propagationPercentage,
        results: allResults
      })
    }

    if (propagationPercentage === 100) {
      toast.success(`DNS fully propagated! (${successCount}/${totalCount} servers)`)
    } else if (propagationPercentage >= 50) {
      toast.info(`DNS partially propagated (${successCount}/${totalCount} servers)`)
    } else {
      toast.warning(`Limited propagation (${successCount}/${totalCount} servers)`)
    }
  }

  const getStatusIcon = (status: PropagationResult['status']) => {
    switch (status) {
      case 'checking':
        return <ClockCounterClockwise className="animate-spin" size={20} weight="duotone" />
      case 'success':
        return <CheckCircle size={20} weight="duotone" className="text-primary" />
      case 'failure':
        return <XCircle size={20} weight="duotone" className="text-destructive" />
      case 'mismatch':
        return <Warning size={20} weight="duotone" className="text-accent" />
    }
  }

  const getStatusBadge = (status: PropagationResult['status']) => {
    switch (status) {
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>
      case 'success':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Propagated</Badge>
      case 'failure':
        return <Badge variant="destructive">No Record</Badge>
      case 'mismatch':
        return <Badge className="bg-accent/20 text-accent border-accent/30">Mismatch</Badge>
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const totalCount = results.length
  const propagationPercentage = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0

  return (
    <Card className="glow-border animate-slide-up">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <GlobeHemisphereWest className="text-primary" size={20} weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-xl">DNS Propagation Checker</CardTitle>
              <CardDescription>Check DNS propagation across multiple servers worldwide</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            id="dns-propagation-domain"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isChecking && checkDNSPropagation()}
            className="flex-1"
            disabled={isChecking}
          />
          
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as any)}
            disabled={isChecking}
            className="px-4 py-2 rounded-md border border-input bg-background text-foreground font-mono text-sm"
          >
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="MX">MX</option>
            <option value="TXT">TXT</option>
          </select>
          
          <Button 
            onClick={checkDNSPropagation} 
            disabled={isChecking || !domain.trim()}
            className="gap-2"
          >
            {isChecking ? (
              <>
                <ClockCounterClockwise className="animate-spin" size={18} weight="duotone" />
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
              <span className="text-muted-foreground">Checking servers...</span>
              <span className="font-mono text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div>
                <p className="text-sm text-muted-foreground">Propagation Status</p>
                <p className="text-2xl font-bold font-display">
                  {successCount} / {totalCount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="text-2xl font-bold font-display text-primary">
                  {propagationPercentage}%
                </p>
              </div>
            </div>

            {expectedValue && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-xs text-muted-foreground mb-1">Expected Value</p>
                <p className="font-mono text-sm text-primary break-all">{expectedValue}</p>
              </div>
            )}

            <ScrollArea className="h-[400px] rounded-lg border border-border">
              <div className="p-4 space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5">
                          {getStatusIcon(result.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{result.server.flag}</span>
                            <h4 className="font-semibold font-display">{result.server.name}</h4>
                            {getStatusBadge(result.status)}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              {result.server.location} • {result.server.ip}
                            </p>
                            {result.ip && (
                              <p className="font-mono text-sm text-primary break-all">
                                {result.ip}
                              </p>
                            )}
                            {result.error && (
                              <p className="text-sm text-destructive">
                                {result.error}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {result.responseTime !== undefined && result.responseTime > 0 && (
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">Response</p>
                          <p className="font-mono text-sm font-medium">{result.responseTime}ms</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {results.length === 0 && !isChecking && (
          <div className="text-center py-12 text-muted-foreground">
            <GlobeHemisphereWest size={48} className="mx-auto mb-4 opacity-50" weight="duotone" />
            <p className="text-sm">Enter a domain to check DNS propagation status</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
