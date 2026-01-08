import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface DNSRecordsProps {
  onScanComplete: (scan: any) => void
}

interface DNSRecord {
  type: string
  value: string
  ttl?: number
}

interface DNSResult {
  domain: string
  records: DNSRecord[]
}

export default function DNSRecords({ onScanComplete }: DNSRecordsProps) {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DNSResult | null>(null)
  const [error, setError] = useState('')
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects()

  const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA']

  const handleLookup = async () => {
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
      const records: DNSRecord[] = []

      for (const type of recordTypes) {
        try {
          const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${type}`)
          const data = await response.json()

          if (data.Answer) {
            data.Answer.forEach((answer: any) => {
              records.push({
                type: type,
                value: answer.data,
                ttl: answer.TTL
              })
            })
          }
        } catch (err) {
          console.error(`Failed to fetch ${type} records`, err)
        }
      }

      if (records.length === 0) {
        setError('No DNS records found for this domain')
        playErrorSound()
        setLoading(false)
        return
      }

      const dnsResult: DNSResult = {
        domain: cleanDomain,
        records
      }

      setResult(dnsResult)
      onScanComplete({
        type: 'dns',
        domain: cleanDomain,
        result: dnsResult
      })
      playScanCompleteSound()
      playSuccessSound()
      toast.success(`Found ${records.length} DNS records for ${cleanDomain}!`)
    } catch (err) {
      setError('Network error occurred. Please try again.')
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }

  const getRecordColor = (type: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-primary/20 text-primary',
      'AAAA': 'bg-secondary/20 text-secondary',
      'MX': 'bg-accent/20 text-accent',
      'TXT': 'bg-yellow-500/20 text-yellow-500',
      'NS': 'bg-purple-500/20 text-purple-500',
      'CNAME': 'bg-cyan-500/20 text-cyan-500',
      'SOA': 'bg-green-500/20 text-green-500'
    }
    return colors[type] || 'bg-muted/20 text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="text-primary" size={24} weight="duotone" />
            DNS Records Lookup
          </CardTitle>
          <CardDescription>
            Retrieve all DNS records (A, AAAA, MX, TXT, NS, CNAME, SOA) for a domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="dns-domain-input"
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
                handleLookup()
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
                  <Database size={18} weight="duotone" />
                  Lookup
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
                  DNS Records for {result.domain}
                </CardTitle>
                <CardDescription>
                  Found {result.records.length} DNS records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.records.map((record, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <Badge className={`${getRecordColor(record.type)} border-0 px-3 shrink-0`}>
                      {record.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm break-all">{record.value}</p>
                      {record.ttl && (
                        <p className="text-xs text-muted-foreground mt-1">TTL: {record.ttl}s</p>
                      )}
                    </div>
                  </motion.div>
                ))}
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
