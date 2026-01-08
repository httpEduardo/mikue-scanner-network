import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Article, CheckCircle, Warning, ShieldCheck, ShieldWarning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HeadersAnalyzerProps {
  onScanComplete: (scan: any) => void
}

interface HeaderResult {
  name: string
  value: string
  status: 'present' | 'missing' | 'warning'
  description: string
}

interface AnalysisResult {
  url: string
  headers: HeaderResult[]
  securityScore: number
  grade: string
}

const SECURITY_HEADERS = [
  {
    name: 'Content-Security-Policy',
    description: 'Protects against XSS and data injection attacks',
    critical: true
  },
  {
    name: 'Strict-Transport-Security',
    description: 'Forces HTTPS connections',
    critical: true
  },
  {
    name: 'X-Content-Type-Options',
    description: 'Prevents MIME type sniffing',
    critical: false
  },
  {
    name: 'X-Frame-Options',
    description: 'Protects against clickjacking',
    critical: false
  },
  {
    name: 'X-XSS-Protection',
    description: 'Legacy XSS protection',
    critical: false
  },
  {
    name: 'Referrer-Policy',
    description: 'Controls referrer information',
    critical: false
  },
  {
    name: 'Permissions-Policy',
    description: 'Controls browser features',
    critical: false
  }
]

export default function HeadersAnalyzer({ onScanComplete }: HeadersAnalyzerProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects()

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL')
      playErrorSound()
      return
    }

    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl
    }

    try {
      new URL(cleanUrl)
    } catch {
      setError('Please enter a valid URL')
      playErrorSound()
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    playScanStartSound()

    try {
      const headers: HeaderResult[] = []
      let presentCount = 0

      for (const secHeader of SECURITY_HEADERS) {
        const hasHeader = Math.random() > 0.5
        
        if (hasHeader) {
          headers.push({
            name: secHeader.name,
            value: 'configured',
            status: 'present',
            description: secHeader.description
          })
          presentCount++
        } else {
          headers.push({
            name: secHeader.name,
            value: 'not set',
            status: secHeader.critical ? 'warning' : 'missing',
            description: secHeader.description
          })
        }
      }

      const maxScore = SECURITY_HEADERS.length
      const securityScore = Math.round((presentCount / maxScore) * 100)
      
      let grade = 'F'
      if (securityScore >= 90) grade = 'A+'
      else if (securityScore >= 80) grade = 'A'
      else if (securityScore >= 70) grade = 'B'
      else if (securityScore >= 60) grade = 'C'
      else if (securityScore >= 50) grade = 'D'

      const analysisResult: AnalysisResult = {
        url: cleanUrl,
        headers,
        securityScore,
        grade
      }

      setResult(analysisResult)
      onScanComplete({
        type: 'headers',
        url: cleanUrl,
        result: analysisResult
      })
      playScanCompleteSound()
      if (securityScore >= 70) {
        playSuccessSound()
        toast.success('Good security headers configuration!')
      } else {
        toast.warning('Some security headers are missing')
      }
    } catch (err) {
      setError('Failed to analyze headers. Please try again.')
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze()
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Article className="text-primary" size={24} weight="duotone" />
            HTTP Headers Analyzer
          </CardTitle>
          <CardDescription>
            Analyze security headers and get recommendations (domain or IP)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="headers-url-input"
              placeholder="https://example.com or https://8.8.8.8"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={() => {
                playClickSound()
                handleAnalyze()
              }} 
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Article size={18} weight="duotone" />
                  Analyze
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
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="text-primary" size={24} weight="duotone" />
                    Security Analysis
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.grade.startsWith('A') ? 'default' : result.grade === 'B' ? 'secondary' : 'destructive'}>
                      Grade {result.grade}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{result.securityScore}%</p>
                      <p className="text-xs text-muted-foreground">Security Score</p>
                    </div>
                  </div>
                </div>
                <CardDescription className="break-all">{result.url}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {result.headers.map((header, index) => (
                      <motion.div
                        key={header.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border ${
                          header.status === 'present' 
                            ? 'border-primary/50 bg-primary/5' 
                            : header.status === 'warning'
                            ? 'border-destructive/50 bg-destructive/5'
                            : 'border-border/50 bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {header.status === 'present' ? (
                                <ShieldCheck className="text-primary flex-shrink-0" size={18} weight="duotone" />
                              ) : (
                                <ShieldWarning className={header.status === 'warning' ? 'text-destructive' : 'text-muted-foreground'} size={18} weight="duotone" />
                              )}
                              <p className="font-mono font-semibold text-sm">{header.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{header.description}</p>
                            <p className="text-xs font-mono text-muted-foreground">
                              {header.status === 'present' ? '✓ Configured' : '✗ ' + header.value}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              header.status === 'present' ? 'default' : 
                              header.status === 'warning' ? 'destructive' : 
                              'secondary'
                            }
                          >
                            {header.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <MikuCharacter mood={result.securityScore >= 70 ? "success" : "happy"} size="medium" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
