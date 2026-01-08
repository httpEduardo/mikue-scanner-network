import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MagnifyingGlass, CheckCircle, Warning, GlobeHemisphereWest } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'

interface DomainLookupProps {
  onScanComplete: (scan: any) => void
}

interface LookupResult {
  domain: string
  ip: string
  country?: string
  city?: string
  isp?: string
  org?: string
}

export default function DomainLookup({ onScanComplete }: DomainLookupProps) {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState('')

  const handleLookup = async () => {
    if (!domain) {
      setError('Please enter a domain name')
      return
    }

    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      setError('Please enter a valid domain name (e.g., example.com)')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`https://ipapi.co/${domain}/json/`)
      const data = await response.json()

      if (data.error) {
        setError(data.reason || 'Failed to lookup domain')
        setLoading(false)
        return
      }

      const lookupResult: LookupResult = {
        domain,
        ip: data.ip,
        country: data.country_name,
        city: data.city,
        isp: data.org,
        org: data.org
      }

      setResult(lookupResult)
      onScanComplete({
        type: 'domain',
        domain,
        result: lookupResult
      })
      toast.success(`Found IP for ${domain}!`)
    } catch (err) {
      setError('Network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeHemisphereWest className="text-primary" size={24} weight="duotone" />
            Domain to IP Lookup
          </CardTitle>
          <CardDescription>
            Enter a domain name to discover its IP address and location information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="domain-input"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleLookup} 
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
                  <MagnifyingGlass size={18} weight="duotone" />
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
                  Lookup Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Domain</p>
                    <p className="font-mono text-lg">{result.domain}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">IP Address</p>
                    <p className="font-mono text-lg text-primary">{result.ip}</p>
                  </div>
                  {result.country && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Country</p>
                      <p className="font-medium">{result.country}</p>
                    </div>
                  )}
                  {result.city && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">City</p>
                      <p className="font-medium">{result.city}</p>
                    </div>
                  )}
                  {result.isp && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ISP/Organization</p>
                      <p className="font-medium">{result.isp}</p>
                    </div>
                  )}
                </div>
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
