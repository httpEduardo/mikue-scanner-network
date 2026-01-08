import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Broadcast, CheckCircle, Warning, LockKey, LockKeyOpen } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'

interface PortScannerProps {
  onScanComplete: (scan: any) => void
}

interface PortResult {
  port: number
  status: 'open' | 'closed'
  service: string
}

const COMMON_PORTS = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 3306, service: 'MySQL' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 6379, service: 'Redis' },
  { port: 8080, service: 'HTTP Alt' },
  { port: 27017, service: 'MongoDB' },
]

export default function PortScanner({ onScanComplete }: PortScannerProps) {
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PortResult[]>([])
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const simulatePortScan = async (host: string) => {
    const scanResults: PortResult[] = []
    
    for (let i = 0; i < COMMON_PORTS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const portInfo = COMMON_PORTS[i]
      const isOpen = Math.random() > 0.7
      
      const result: PortResult = {
        port: portInfo.port,
        status: isOpen ? 'open' : 'closed',
        service: portInfo.service
      }
      
      scanResults.push(result)
      setResults([...scanResults])
      setProgress(((i + 1) / COMMON_PORTS.length) * 100)
    }
    
    return scanResults
  }

  const handleScan = async () => {
    if (!target) {
      setError('Please enter a target IP or domain')
      return
    }

    setLoading(true)
    setError('')
    setResults([])
    setProgress(0)

    try {
      const scanResults = await simulatePortScan(target)
      
      onScanComplete({
        type: 'port',
        target,
        results: scanResults,
        openPorts: scanResults.filter(r => r.status === 'open').length
      })
      
      const openCount = scanResults.filter(r => r.status === 'open').length
      toast.success(`Scan complete! Found ${openCount} open ports`)
    } catch (err) {
      setError('Scan failed. Please try again.')
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
            <Broadcast className="text-primary" size={24} weight="duotone" />
            Port Scanner
          </CardTitle>
          <CardDescription>
            Scan common ports on any target IP or domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="target-input"
              placeholder="192.168.1.1 or example.com"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleScan} 
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
                  <Broadcast size={18} weight="duotone" />
                  Scan
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scanning ports...</span>
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
        {loading && results.length === 0 && (
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
            className="space-y-6"
          >
            <Card className="glow-border bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-primary" size={24} weight="duotone" />
                  Scan Results
                  <Badge variant="secondary" className="ml-auto">
                    {results.filter(r => r.status === 'open').length} Open
                  </Badge>
                </CardTitle>
                <CardDescription>Target: {target}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <motion.div
                      key={result.port}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        result.status === 'open' 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'border-border/50 bg-muted/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.status === 'open' ? (
                          <LockKeyOpen className="text-primary" size={20} weight="duotone" />
                        ) : (
                          <LockKey className="text-muted-foreground" size={20} weight="duotone" />
                        )}
                        <div>
                          <p className="font-mono font-medium">
                            Port {result.port}
                          </p>
                          <p className="text-xs text-muted-foreground">{result.service}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={result.status === 'open' ? 'default' : 'secondary'}
                        className={result.status === 'open' ? 'bg-primary' : ''}
                      >
                        {result.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {!loading && (
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
