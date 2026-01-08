import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Sword,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Warning,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface HTTPMethodTesterProps {
  onScanComplete?: (scan: any) => void
}

interface MethodResult {
  method: string
  allowed: boolean
  statusCode?: number
  statusText?: string
  error?: string
  responseTime?: number
}

export default function HTTPMethodTester({ onScanComplete }: HTTPMethodTesterProps) {
  const [testUrl, setTestUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MethodResult[]>([])
  const { playClickSound, playSuccessSound, playErrorSound } = useSoundEffects()

  const HTTP_METHODS = [
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 
    'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'
  ]

  const testMethod = async (method: string, url: string): Promise<MethodResult> => {
    const startTime = Date.now()
    
    try {
      const response = await fetch(url, {
        method: method,
        mode: 'cors'
      })
      
      const responseTime = Date.now() - startTime
      
      return {
        method,
        allowed: response.status < 405,
        statusCode: response.status,
        statusText: response.statusText,
        responseTime
      }
    } catch (err) {
      return {
        method,
        allowed: false,
        error: 'Network/CORS Error'
      }
    }
  }

  const testAllMethods = async () => {
    if (!testUrl.trim()) {
      toast.error('Please enter a URL')
      playErrorSound()
      return
    }

    playClickSound()
    setLoading(true)
    setResults([])

    try {
      let targetUrl = testUrl.trim()
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl
      }

      const methodResults: MethodResult[] = []
      
      for (const method of HTTP_METHODS) {
        const result = await testMethod(method, targetUrl)
        methodResults.push(result)
      }

      setResults(methodResults)

      const allowed = methodResults.filter(r => r.allowed).map(r => r.method)

      if (onScanComplete) {
        onScanComplete({
          type: 'http-methods',
          target: targetUrl,
          results: methodResults,
          allowedMethods: allowed,
          allowedCount: allowed.length,
          totalTested: HTTP_METHODS.length
        })
      }

      playSuccessSound()
      toast.success(`HTTP methods tested successfully`)
    } catch (err) {
      playErrorSound()
      toast.error('Failed to test HTTP methods')
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (method: string, allowed: boolean) => {
    if (!allowed) return null
    
    const sensitiveMethod = ['DELETE', 'PUT', 'PATCH', 'TRACE', 'CONNECT'].includes(method)
    
    if (sensitiveMethod) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Warning size={12} weight="duotone" />
          High Risk
        </Badge>
      )
    }
    
    if (['POST'].includes(method)) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Warning size={12} weight="duotone" />
          Moderate Risk
        </Badge>
      )
    }
    
    return null
  }

  const allowedMethods = results.filter(r => r.allowed)

  return (
    <Card className="glow-border animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sword size={24} weight="duotone" className="text-primary" />
          </div>
          HTTP Method Tester
        </CardTitle>
        <CardDescription>
          Test which HTTP methods are allowed on a target URL (domain or IP)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Input
            id="method-test-url"
            placeholder="Enter URL (e.g., https://example.com or https://8.8.8.8)"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && testAllMethods()}
            disabled={loading}
            className="font-mono"
          />
          <Button 
            onClick={testAllMethods}
            disabled={loading}
            className="gap-2 min-w-[120px]"
          >
            <MagnifyingGlass size={18} weight="duotone" />
            {loading ? 'Testing...' : 'Test'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                <div className="text-xs text-muted-foreground mb-1">Allowed Methods</div>
                <div className="text-2xl font-bold text-primary">{allowedMethods.length}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                <div className="text-xs text-muted-foreground mb-1">Total Tested</div>
                <div className="text-2xl font-bold">{results.length}</div>
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {results.map((result) => (
                  <div 
                    key={result.method}
                    className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {result.allowed ? (
                          <CheckCircle size={20} weight="duotone" className="text-primary" />
                        ) : (
                          <XCircle size={20} weight="duotone" className="text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-mono font-semibold text-sm">{result.method}</div>
                          {result.statusCode && (
                            <div className="text-xs text-muted-foreground">
                              Status: {result.statusCode} {result.statusText}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRiskBadge(result.method, result.allowed)}
                        <Badge variant={result.allowed ? "default" : "secondary"}>
                          {result.allowed ? 'Allowed' : 'Blocked'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs">
                      {result.responseTime !== undefined && (
                        <div className="text-muted-foreground">
                          Response time: <span className="font-mono">{result.responseTime}ms</span>
                        </div>
                      )}
                      {result.error && (
                        <div className="text-destructive">
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {allowedMethods.length > 0 && (
              <Alert>
                <Warning size={16} weight="duotone" />
                <AlertDescription>
                  Found {allowedMethods.length} allowed HTTP method{allowedMethods.length !== 1 ? 's' : ''}.
                  {allowedMethods.some(r => ['DELETE', 'PUT', 'PATCH', 'TRACE', 'CONNECT'].includes(r.method)) && (
                    <span className="block mt-1 text-destructive font-medium">
                      Warning: Sensitive methods detected. Review security implications.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
