import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  ShieldSlash,
  ShieldCheck,
  ShieldWarning,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Warning,
  Info
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface CORSAnalyzerProps {
  onScanComplete?: (scan: any) => void
}

interface CORSResult {
  url: string
  accessControlAllowOrigin?: string
  accessControlAllowMethods?: string
  accessControlAllowHeaders?: string
  accessControlAllowCredentials?: string
  accessControlMaxAge?: string
  accessControlExposeHeaders?: string
  hasWildcard: boolean
  allowsCredentials: boolean
  securityLevel: 'secure' | 'moderate' | 'permissive' | 'vulnerable'
  issues: string[]
  recommendations: string[]
}

export default function CORSAnalyzer({ onScanComplete }: CORSAnalyzerProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CORSResult | null>(null)
  const [error, setError] = useState('')
  const { playClickSound, playSuccessSound, playErrorSound } = useSoundEffects()

  const analyzeCORS = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      playErrorSound()
      return
    }

    playClickSound()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      let targetUrl = url.trim()
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl
      }

      const response = await fetch(targetUrl, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      }).catch(() => {
        return fetch(targetUrl, { method: 'GET' })
      })

      const headers = response.headers

      const accessControlAllowOrigin = headers.get('Access-Control-Allow-Origin') || undefined
      const accessControlAllowMethods = headers.get('Access-Control-Allow-Methods') || undefined
      const accessControlAllowHeaders = headers.get('Access-Control-Allow-Headers') || undefined
      const accessControlAllowCredentials = headers.get('Access-Control-Allow-Credentials') || undefined
      const accessControlMaxAge = headers.get('Access-Control-Max-Age') || undefined
      const accessControlExposeHeaders = headers.get('Access-Control-Expose-Headers') || undefined

      const hasWildcard = accessControlAllowOrigin === '*'
      const allowsCredentials = accessControlAllowCredentials === 'true'

      const issues: string[] = []
      const recommendations: string[] = []
      let securityLevel: 'secure' | 'moderate' | 'permissive' | 'vulnerable' = 'secure'

      if (!accessControlAllowOrigin) {
        issues.push('No CORS headers detected - cross-origin requests will be blocked')
        securityLevel = 'secure'
      } else if (hasWildcard && allowsCredentials) {
        issues.push('CRITICAL: Wildcard origin with credentials enabled - major security vulnerability')
        securityLevel = 'vulnerable'
        recommendations.push('Never use wildcard (*) with credentials')
        recommendations.push('Specify exact allowed origins')
      } else if (hasWildcard) {
        issues.push('Wildcard origin allows any domain to access resources')
        securityLevel = 'permissive'
        recommendations.push('Consider restricting to specific origins')
      } else if (allowsCredentials) {
        issues.push('Credentials are allowed - ensure origin is strictly validated')
        securityLevel = 'moderate'
      }

      if (accessControlAllowMethods && accessControlAllowMethods.includes('DELETE')) {
        issues.push('DELETE method is allowed - ensure proper authorization')
        recommendations.push('Restrict HTTP methods to only what is needed')
      }

      if (accessControlAllowMethods && accessControlAllowMethods.split(',').length > 5) {
        issues.push('Many HTTP methods are allowed')
        recommendations.push('Minimize allowed methods to reduce attack surface')
      }

      if (accessControlAllowHeaders && accessControlAllowHeaders === '*') {
        issues.push('All headers are allowed via wildcard')
        recommendations.push('Explicitly list allowed headers')
      }

      if (!accessControlMaxAge) {
        recommendations.push('Consider setting Access-Control-Max-Age to cache preflight requests')
      }

      if (accessControlAllowOrigin && accessControlAllowOrigin !== '*' && !accessControlAllowOrigin.startsWith('https://')) {
        issues.push('Origin allows HTTP (non-HTTPS) connections')
        recommendations.push('Only allow HTTPS origins for security')
      }

      const corsResult: CORSResult = {
        url: targetUrl,
        accessControlAllowOrigin,
        accessControlAllowMethods,
        accessControlAllowHeaders,
        accessControlAllowCredentials,
        accessControlMaxAge,
        accessControlExposeHeaders,
        hasWildcard,
        allowsCredentials,
        securityLevel,
        issues,
        recommendations
      }

      setResult(corsResult)
      playSuccessSound()
      toast.success('CORS analysis complete!')

      if (onScanComplete) {
        onScanComplete({
          type: 'cors',
          url: targetUrl,
          result: corsResult
        })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze CORS'
      setError(errorMsg)
      playErrorSound()
      toast.error('CORS analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'secure':
        return <ShieldCheck size={20} weight="duotone" className="text-green-500" />
      case 'moderate':
        return <ShieldWarning size={20} weight="duotone" className="text-yellow-500" />
      case 'permissive':
        return <ShieldSlash size={20} weight="duotone" className="text-orange-500" />
      case 'vulnerable':
        return <ShieldSlash size={20} weight="duotone" className="text-red-500" />
      default:
        return <ShieldCheck size={20} weight="duotone" />
    }
  }

  const getSecurityBadge = (level: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
      secure: 'default',
      moderate: 'secondary',
      permissive: 'secondary',
      vulnerable: 'destructive'
    }
    return (
      <Badge variant={variants[level] || 'default'} className="gap-2">
        {getSecurityIcon(level)}
        {level.toUpperCase()}
      </Badge>
    )
  }

  return (
    <Card className="glow-border animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <ShieldSlash size={24} weight="duotone" className="text-primary" />
          </div>
          CORS Analyzer
        </CardTitle>
        <CardDescription>
          Check Cross-Origin Resource Sharing policies and security configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Input
            id="cors-url"
            placeholder="Enter URL (e.g., api.example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeCORS()}
            disabled={loading}
            className="font-mono"
          />
          <Button 
            onClick={analyzeCORS} 
            disabled={loading}
            className="gap-2 min-w-[120px]"
          >
            <MagnifyingGlass size={18} weight="duotone" />
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle size={18} weight="duotone" />
            <AlertDescription className="ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Security Assessment</h3>
                {getSecurityBadge(result.securityLevel)}
              </div>
              <p className="text-sm text-muted-foreground font-mono break-all">{result.url}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Info size={18} weight="duotone" className="text-primary" />
                CORS Headers
              </h4>
              <div className="space-y-3">
                {result.accessControlAllowOrigin ? (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Access-Control-Allow-Origin</p>
                        <p className="font-mono text-sm break-all">{result.accessControlAllowOrigin}</p>
                      </div>
                      {result.hasWildcard && (
                        <Badge variant="secondary" className="shrink-0">
                          <Warning size={14} weight="duotone" className="mr-1" />
                          Wildcard
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-sm text-muted-foreground">No Access-Control-Allow-Origin header found</p>
                  </div>
                )}

                {result.accessControlAllowMethods && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Access-Control-Allow-Methods</p>
                    <div className="flex flex-wrap gap-2">
                      {result.accessControlAllowMethods.split(',').map((method, idx) => (
                        <Badge key={idx} variant="outline" className="font-mono">
                          {method.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.accessControlAllowHeaders && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Access-Control-Allow-Headers</p>
                    <p className="font-mono text-sm break-all">{result.accessControlAllowHeaders}</p>
                  </div>
                )}

                {result.accessControlAllowCredentials && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Access-Control-Allow-Credentials</p>
                      <Badge variant={result.allowsCredentials ? 'secondary' : 'outline'}>
                        {result.accessControlAllowCredentials}
                      </Badge>
                    </div>
                  </div>
                )}

                {result.accessControlMaxAge && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Access-Control-Max-Age</p>
                      <Badge variant="outline" className="font-mono">
                        {result.accessControlMaxAge}s
                      </Badge>
                    </div>
                  </div>
                )}

                {result.accessControlExposeHeaders && (
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Access-Control-Expose-Headers</p>
                    <p className="font-mono text-sm break-all">{result.accessControlExposeHeaders}</p>
                  </div>
                )}
              </div>
            </div>

            {result.issues.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Warning size={18} weight="duotone" className="text-yellow-500" />
                  Security Issues
                </h4>
                <div className="space-y-2">
                  {result.issues.map((issue, idx) => (
                    <Alert key={idx} variant={result.securityLevel === 'vulnerable' ? 'destructive' : 'default'}>
                      <XCircle size={16} weight="duotone" />
                      <AlertDescription className="ml-2 text-sm">{issue}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle size={18} weight="duotone" className="text-primary" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm flex items-start gap-2">
                        <CheckCircle size={16} weight="duotone" className="text-primary shrink-0 mt-0.5" />
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
