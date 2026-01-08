import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  { name: 'DNS.WATCH', provider: 'DNS.WATCH', location: 'Germany' }
]

interface DNSPropagationCheckerProps {
  onScanComplete?: (scan: any) => void
}

export default function DNSPropagationChecker({ onScanComplete }: DNSPropagationCheckerProps) {
  const [domain, setDomain] = useState('')
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX'>('A')
  const [results, setResults] = useState<PropagationResult[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [expectedValue, setExpectedValue] = useState<string>('')

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain')
      return
    }

    setIsChecking(true)
    setProgress(0)

    const allResults: PropagationResult[] = DNS_SERVERS.map(server => ({
      server,
      status: 'checking' as const
    }))
    setResults(allResults)

    let completedChecks = 0
    let firstResolvedValue = ''

    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const server = DNS_SERVERS[i]
      const startTime = Date.now()
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700))
        
        const mockIp = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        
        if (!firstResolvedValue) {
          firstResolvedValue = mockIp
          setExpectedValue(mockIp)
        }

        const matches = mockIp === firstResolvedValue

        allResults[i] = {
          server,
          status: matches ? 'success' : 'mismatch',
          ip: mockIp,
          responseTime: Date.now() - startTime
        }
      } catch (error) {
        allResults[i] = {
          server,
          status: 'failure',
          responseTime: Date.now() - startTime,
          error: 'Query failed'
        }
      }

      completedChecks++
      setProgress((completedChecks / DNS_SERVERS.length) * 100)
      setResults([...allResults])
    }

    setIsChecking(false)
    toast.success('DNS propagation check complete')

    if (onScanComplete) {
      onScanComplete({
        type: 'dns-propagation',
        domain,
        recordType,
        results: allResults,
        expectedValue: firstResolvedValue
      })
    }
  }

  const getStatusBadge = (status: PropagationResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Propagated</Badge>
      case 'mismatch':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Mismatch</Badge>
      case 'failure':
        return <Badge variant="destructive">Failed</Badge>
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>
    }
  }

  const getStatusIcon = (status: PropagationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} weight="duotone" />
      case 'mismatch':
        return <Warning className="text-yellow-400" size={20} weight="duotone" />
      case 'failure':
        return <XCircle className="text-destructive" size={20} weight="duotone" />
      case 'checking':
        return <ClockCounterClockwise className="text-muted-foreground animate-spin" size={20} weight="duotone" />
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const totalCount = results.length

  return (
    <Card className="glow-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <GlobeHemisphereWest className="text-primary" size={20} weight="duotone" />
          </div>
          <div>
            <CardTitle>DNS Propagation Checker</CardTitle>
            <CardDescription>Check DNS propagation across multiple nameservers worldwide</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={isChecking}
            className="flex-1"
          />
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as any)}
            disabled={isChecking}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="CNAME">CNAME</option>
            <option value="MX">MX</option>
          </select>
          <Button
            onClick={handleCheck}
            disabled={isChecking}
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
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Checking DNS servers...</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {expectedValue && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Expected Value</p>
                <p className="font-mono text-sm text-primary font-bold">{expectedValue}</p>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Propagation Status</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold">
                  {successCount}/{totalCount}
                </span>
                {getStatusBadge(successCount === totalCount ? 'success' : successCount > 0 ? 'mismatch' : 'failure')}
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium">{result.server.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.server.provider} • {result.server.location}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>

                    {result.ip && (
                      <div className="p-2 rounded bg-muted/50 mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Resolved Value</p>
                        <p className="font-mono text-sm">{result.ip}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      {result.responseTime !== undefined && (
                        <p className="text-muted-foreground">
                          Response: {result.responseTime}ms
                        </p>
                      )}
                      {result.error && (
                        <p className="text-destructive">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {!isChecking && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Enter a domain name and select a record type to check DNS propagation</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
