import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Sword,
  CheckCircle,
  XCircle,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT']

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

  const testMethod = async (method: string, targetUrl: string): Promise<MethodResult> => {
    try {
      const startTime = performance.now()
      const url = targetUrl.replace(/\/$/, '')
      
      const response = await fetch(url, {
        method,
        mode: 'cors',
      })
      
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)

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

      toast.success(`HTTP methods tested successfully`)
    } catch (err) {
      toast.error('Failed to test HTTP methods')
    } finally {
      setLoading(false)
    }
  }

  const allowedMethods = results.filter(r => r.allowed)

  return (
    <Card className="glow-border animate-slide-up">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Sword className="text-primary" size={20} weight="duotone" />
          </div>
          <div>
            <CardTitle className="text-xl">HTTP Method Tester</CardTitle>
            <CardDescription>Test which HTTP methods are allowed on a target</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            id="http-method-url"
            placeholder="https://example.com"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && testAllMethods()}
            disabled={loading}
          />
          <Button 
            onClick={testAllMethods}
            disabled={loading || !testUrl.trim()}
            className="gap-2"
          >
            {loading ? 'Testing...' : 'Test'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Allowed Methods</p>
                  <p className="text-2xl font-bold font-display">{allowedMethods.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Tested</p>
                  <p className="text-2xl font-bold font-display">{results.length}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[400px] rounded-lg border border-border">
              <div className="p-4 space-y-2">
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
                        {result.responseTime && (
                          <span className="text-xs font-mono text-muted-foreground">
                            {result.responseTime}ms
                          </span>
                        )}
                        {result.allowed ? (
                          <Badge className="bg-primary/20 text-primary border-primary/30">Allowed</Badge>
                        ) : (
                          <Badge variant="secondary">Blocked</Badge>
                        )}
                      </div>
                    </div>
                    {result.error && (
                      <p className="text-xs text-destructive">{result.error}</p>
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

        {results.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Sword size={48} className="mx-auto mb-4 opacity-50" weight="duotone" />
            <p className="text-sm">Enter a URL to test HTTP methods</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
