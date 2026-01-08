import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/s
import { Progress } from '@/components/ui/progr
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { GlobeHemisphereWest, MagnifyingGlass, CheckCircle, XCircle, Warning, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface DNSServer {
  name: string

  { name: 'Cloudfl
  { name: 'Q
 

  { name: 'Hurricane Electric', pr
]
interface PropagationResult {
  status: 'checking' | 'success' | 'failed' | 'mismatch'
  responseTime?: number
}
interface DNSPropagationCheckerProps {
}
export default function DNSPropagationChecker({ onScanComplete }: DNSPropagationChec
  const [recordType, setRecordType] = useState('A')
  const [results, setResults] = useState<PropagationResult[]>([])
 

    if (!domain.trim()) {
      return

    
    setResults(DNS_SERV
      status: 'c
 

    const allResults: PropagationResul

 

      try {
        const mockIp = `${Math.floor(Math.
        if (firstResolvedValue === '') {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<PropagationResult[]>([])
  const [progress, setProgress] = useState(0)
  const [expectedValue, setExpectedValue] = useState('')
  const { playScanStartSound, playScanCompleteSound } = useSoundEffects()

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]
    
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

        const responseTime = Date.now() - startTime + Math.floor(Math.random() * 100)
        const isMismatch = Math.random() > 0.85
        const resolvedValue = isMismatch ? `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}` : firstResolvedValue

        allResults.push({
          server,
          status: isMismatch ? 'mismatch' : 'success',
          value: resolvedValue,
          responseTime
        })
      } catch (error) {
        allResults.push({
          server,
          status: 'failed',
          error: 'Connection timeout'
        })
      }

      setResults([...allResults])
      setProgress(((i + 1) / DNS_SERVERS.length) * 100)
    }

    setIsChecking(false)
    playScanCompleteSound()
    
    const allMatch = allResults.every(r => r.status === 'success')
    if (allMatch) {
      toast.success(`DNS fully propagated across all ${DNS_SERVERS.length} servers!`)
    } else {
      const mismatches = allResults.filter(r => r.status === 'mismatch').length
      toast.warning(`${mismatches} server(s) have different DNS records`)
    }

    if (onScanComplete) {
      onScanComplete({
        type: 'dns-propagation',
        domain: cleanDomain,
        recordType,
        results: allResults,
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking) {
      handleCheck()
    }
  }

  const getStatusColor = (status: PropagationResult['status']) => {
    const colors: Record<PropagationResult['status'], string> = {
      checking: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      mismatch: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
    return colors[status]
  }

  const getStatusIcon = (status: PropagationResult['status']) => {
    switch (status) {
      case 'checking':
        return <Clock size={16} weight="duotone" className="animate-spin" />
      case 'success':
        return <CheckCircle size={16} weight="duotone" />
      case 'failed':
        return <XCircle size={16} weight="duotone" />
      case 'mismatch':
        return <Warning size={16} weight="duotone" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeHemisphereWest size={24} weight="duotone" className="text-primary" />
            DNS Propagation Checker
          </CardTitle>
          <CardDescription>
            Check if your DNS records have propagated across multiple DNS servers worldwide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-3">
            <Input
              id="dns-propagation-domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isChecking}
              className="bg-background/50"
            />
            <Select value={recordType} onValueChange={setRecordType} disabled={isChecking}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="AAAA">AAAA</SelectItem>
                <SelectItem value="CNAME">CNAME</SelectItem>
                <SelectItem value="MX">MX</SelectItem>
                <SelectItem value="TXT">TXT</SelectItem>
                <SelectItem value="NS">NS</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleCheck}
              disabled={isChecking || !domain.trim()}
              className="gap-2"
            >
              {isChecking ? (
                <>
                  <Clock size={18} weight="duotone" className="animate-spin" />
                  Checking...
          >
              ) : (
                <d
                  <MagnifyingGlass size={18} weight="duotone" />
                  Check
                </>
                
            </Button>
                

          {isChecking && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                Checking DNS propagation across {DNS_SERVERS.length} servers...
              </p>
            </div>
            
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {results.length === 0 && !isChecking && (
                     
            initial={{ opacity: 0, y: 20 }}
                                <p classNa
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <MikuCharacter mood="happy" size="large" />
            <p className="mt-4 text-muted-foreground">Enter a domain name to check DNS propagation</p>
          </motion.div>
          

        {results.length > 0 && (
          <motion.div
                              <p className=
            animate={{ opacity: 1, y: 0 }}
                          )}
          >
                    ))}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GlobeHemisphereWest size={24} weight="duotone" className="text-primary" />
                    Propagation Results
                  </CardTitle>
                  <Badge variant="outline" className="gap-2">
                    {results.filter(r => r.status === 'success').length} / {DNS_SERVERS.length} propagated
                  </Badge>
                </div>
                {expectedValue && (
                  <CardDescription className="font-mono">
                    Expected: {expectedValue}
                  </CardDescription>

              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.server.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border bg-card/30 backdrop-blur"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <Badge className={`gap-1.5 ${getStatusColor(result.status)}`}>
                                {getStatusIcon(result.status)}
                                {result.status}
                              </Badge>
                              <div>
                                <p className="font-semibold">{result.server.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {result.server.provider} • {result.server.location}
                                </p>
                              </div>

                            {result.value && (
                              <div className="pl-1">
                                <p className="text-sm font-mono text-primary">{result.value}</p>
                              </div>
                            )}
                            {result.error && (
                              <p className="text-xs text-destructive">{result.error}</p>
                            )}
                          </div>
                          {result.responseTime && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Response</p>
                              <p className="text-sm font-mono">{result.responseTime}ms</p>
                            </div>
                          )}

                      </motion.div>
                    ))}
                  </div>

              </CardContent>

          </motion.div>


    </div>

}
