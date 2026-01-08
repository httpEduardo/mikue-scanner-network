import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT']

export default function HTTPMethodTester({ onScanComplete }: HTTPMethodTesterProps) {
  const [testUrl, setTestUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MethodResult[]>([])
  const { playClickSound, playSuccessSound, playErrorSound } = useSoundEffects()

  const testMethod = async (method: string, url: string): Promise<MethodResult> => {
    const startTime = performance.now()
    
    try {
      const response = await fetch(url, {
        method,
        mode: 'cors',
        cache: 'no-cache',
      })
      
      const responseTime = Math.round(performance.now() - startTime)
      
      return {
        method,
        allowed: response.ok || response.status < 500,
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

  const allowedMethods = results.filter(r => r.allowed)

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sword size={24} weight="duotone" className="text-primary" />
          HTTP Method Tester
        </CardTitle>
        <CardDescription>
          Test which HTTP methods are allowed on a target URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder="Enter URL (e.g., https://example.com)"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            disabled={loading}
          />
          <Button 
            onClick={testAllMethods}
            disabled={loading}
            className="gap-2"
          >
            <MagnifyingGlass size={18} weight="duotone" />
            {loading ? 'Testing...' : 'Test Methods'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
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
                      <div className="text-right">
                        <Badge variant={result.allowed ? "default" : "secondary"}>
                          {result.allowed ? 'Allowed' : 'Blocked'}
                        </Badge>
                        {result.responseTime !== undefined && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {result.responseTime}ms
                          </div>
                        )}
                      </div>
                    </div>
                    {result.error && (
                      <div className="text-xs text-destructive mt-2">
                        {result.error}
                      </div>
                    )}
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
