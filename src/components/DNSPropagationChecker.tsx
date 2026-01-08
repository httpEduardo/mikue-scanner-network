import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  GlobeHemisphereWest,
  CheckCircle,
  XCircle,
  Warning,
  ClockCounterClockwise
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
  responseTime?: number
  error?: string
}

const DNS_SERVERS: DNSServer[] = [
  { name: 'Cloudflare', location: 'Global', ip: '1.1.1.1', flag: '🌐' },
  { name: 'Google', location: 'Global', ip: '8.8.8.8', flag: '🌐' },
  { name: 'OpenDNS', location: 'USA', ip: '208.67.222.222', flag: '🇺🇸' },
  { name: 'Quad9', location: 'Global', ip: '9.9.9.9', flag: '🌐' },
  { name: 'Comodo', location: 'USA', ip: '8.26.56.26', flag: '🇺🇸' },
  { name: 'Verisign', location: 'USA', ip: '64.6.64.6', flag: '🇺🇸' },
  { name: 'CleanBrowsing', location: 'USA', ip: '185.228.168.9', flag: '🇺🇸' },
  { name: 'AdGuard', location: 'Global', ip: '94.140.14.14', flag: '🌐' }
]

interface DNSPropagationCheckerProps {
  onScanComplete?: (scan: any) => void
}

export default function DNSPropagationChecker({ onScanComplete }: DNSPropagationCheckerProps) {
  const [domain, setDomain] = useState('')
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT'>('A')
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<PropagationResult[]>([])
  const [expectedValue, setExpectedValue] = useState('')
  const [progress, setProgress] = useState(0)

  const checkDNSPropagation = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    setIsChecking(true)
    setResults([])
    setProgress(0)
    setExpectedValue('')

    const allResults: PropagationResult[] = []
    let completedChecks = 0
    let firstResolvedValue = ''

    for (const server of DNS_SERVERS) {
      const startTime = Date.now()
      
      try {
        const response = await fetch(
          `https://dns.google/resolve?name=${domain}&type=${recordType}`
        )
        const data = await response.json()
        const responseTime = Date.now() - startTime

        if (data.Answer && data.Answer.length > 0) {
          const resolvedValue = data.Answer[0].data
          
          if (!firstResolvedValue) {
            firstResolvedValue = resolvedValue
            setExpectedValue(resolvedValue)
          }

          allResults.push({
            server,
            status: resolvedValue === firstResolvedValue ? 'success' : 'mismatch',
            ip: resolvedValue,
            responseTime
          })
        } else {
          allResults.push({
            server,
            status: 'failure',
            responseTime,
            error: 'No records found'
          })
        }
      } catch (error) {
        allResults.push({
          server,
          status: 'failure',
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: 0
        })
      }

      completedChecks++
      setProgress((completedChecks / DNS_SERVERS.length) * 100)
      setResults([...allResults])
    }

    setIsChecking(false)

    if (onScanComplete) {
      onScanComplete({
        type: 'dns-propagation',
        domain,
        recordType,
        results: allResults
      })
    }

    const successCount = allResults.filter(r => r.status === 'success').length
    toast.success(`DNS propagation check complete: ${successCount}/${DNS_SERVERS.length} servers`)
  }

  const getStatusBadge = (status: PropagationResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-500 border-green-500/30">
          <CheckCircle size={14} weight="fill" />
          Propagated
        </Badge>
      case 'mismatch':
        return <Badge variant="outline" className="gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
          <Warning size={14} weight="fill" />
          Mismatch
        </Badge>
      case 'failure':
        return <Badge variant="outline" className="gap-1 bg-red-500/10 text-red-500 border-red-500/30">
          <XCircle size={14} weight="fill" />
          Failed
        </Badge>
      case 'checking':
        return <Badge variant="outline" className="gap-1">
          <ClockCounterClockwise size={14} weight="duotone" className="animate-spin" />
          Checking...
        </Badge>
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const totalCount = results.length
  const propagationPercentage = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0

  return (
    <Card className="glow-border animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlobeHemisphereWest className="text-primary" size={24} weight="duotone" />
          DNS Propagation Checker
        </CardTitle>
        <CardDescription>
          Check if your DNS records have propagated across global DNS servers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={domain}
            placeholder="example.com"
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isChecking && checkDNSPropagation()}
            className="flex-1"
            id="dns-propagation-domain"
          />
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="MX">MX</option>
            <option value="TXT">TXT</option>
          </select>
          <Button 
            disabled={isChecking} 
            onClick={checkDNSPropagation}
            className="gap-2"
          >
            {isChecking ? (
              <>
                <ClockCounterClockwise size={18} weight="duotone" className="animate-spin" />
                Checking...
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Checking DNS servers...</span>
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
                <p className="text-2xl font-bold text-primary">
                  {successCount}/{totalCount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="font-mono text-sm text-primary font-bold">
                  {propagationPercentage}%
                </p>
              </div>
            </div>

            {expectedValue && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Expected Value:</p>
                <p className="font-mono text-sm text-primary break-all">{expectedValue}</p>
              </div>
            )}

            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-2">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="text-2xl shrink-0">{result.server.flag}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{result.server.name}</p>
                          {getStatusBadge(result.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {result.server.location} • {result.server.ip}
                        </p>
                        {result.ip && (
                          <p className="font-mono text-sm text-primary mt-1 break-all">
                            {result.ip}
                          </p>
                        )}
                        {result.error && (
                          <p className="text-xs text-destructive mt-1">
                            {result.error}
                          </p>
                        )}
                      </div>
                    </div>
                    {result.responseTime !== undefined && (
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">Response</p>
                        <p className="font-mono text-sm font-semibold">{result.responseTime}ms</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {!isChecking && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <GlobeHemisphereWest size={48} weight="duotone" className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Enter a domain to check DNS propagation</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
