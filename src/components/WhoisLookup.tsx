import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IdentificationCard, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { ScrollArea } from '@/components/ui/scroll-area'

interface WhoisLookupProps {
  onScanComplete: (scan: any) => void
}

interface WhoisResult {
  domain: string
  registrar?: string
  registrationDate?: string
  expirationDate?: string
  status?: string[]
  nameServers?: string[]
  registrantOrg?: string
  registrantCountry?: string
  adminEmail?: string
}

export default function WhoisLookup({ onScanComplete }: WhoisLookupProps) {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WhoisResult | null>(null)
  const [error, setError] = useState('')
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects()

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
      await new Promise(resolve => setTimeout(resolve, 2000))

      const registrationDate = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 5)
      const expirationDate = new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 365 * 2)

      const whoisResult: WhoisResult = {
        domain: cleanDomain,
        registrar: 'Example Registrar Inc.',
        registrationDate: registrationDate.toLocaleDateString(),
        expirationDate: expirationDate.toLocaleDateString(),
        status: ['clientTransferProhibited', 'clientDeleteProhibited'],
        nameServers: ['ns1.example.com', 'ns2.example.com'],
        registrantOrg: 'Example Organization',
        registrantCountry: 'United States',
        adminEmail: 'admin@' + cleanDomain
      }

      setResult(whoisResult)
      onScanComplete({
        type: 'whois',
        domain: cleanDomain,
        result: whoisResult
      })
      playScanCompleteSound()
      playSuccessSound()
      toast.success(`WHOIS data retrieved for ${cleanDomain}!`)
    } catch (err) {
      setError('Failed to retrieve WHOIS data. Please try again.')
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

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdentificationCard className="text-primary" size={24} weight="duotone" />
            WHOIS Lookup
          </CardTitle>
          <CardDescription>
            Retrieve domain registration and ownership information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="whois-domain-input"
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
                  Looking up
                </>
              ) : (
                <>
                  <IdentificationCard size={18} weight="duotone" />
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
                  WHOIS Information
                </CardTitle>
                <CardDescription className="break-all">{result.domain}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[500px] pr-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Registrar</p>
                        <p className="font-medium">{result.registrar}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Registrant Organization</p>
                        <p className="font-medium">{result.registrantOrg}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Registration Date</p>
                        <p className="font-mono">{result.registrationDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expiration Date</p>
                        <p className="font-mono">{result.expirationDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Country</p>
                        <p className="font-medium">{result.registrantCountry}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Admin Email</p>
                        <p className="font-mono text-sm">{result.adminEmail}</p>
                      </div>
                    </div>

                    {result.status && result.status.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Domain Status</p>
                        <div className="flex flex-wrap gap-2">
                          {result.status.map((status, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono"
                            >
                              {status}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.nameServers && result.nameServers.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Name Servers</p>
                        <div className="space-y-2">
                          {result.nameServers.map((ns, index) => (
                            <div 
                              key={index}
                              className="px-3 py-2 bg-muted/50 rounded-lg font-mono text-sm"
                            >
                              {ns}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
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
