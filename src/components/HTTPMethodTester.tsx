import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Warning,
  Sword
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
                {results.map((result, index) => (
                  <Card key={index} className="bg-card/30">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            result.allowed 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {result.allowed ? (
                              <CheckCircle size={20} weight="duotone" />
                            ) : (
                              <XCircle size={20} weight="duotone" />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold">{result.method}</span>
                              {result.allowed && (
                                <Badge variant="default" className="bg-primary">Allowed</Badge>
                              )}
                              {!result.allowed && (
                                <Badge variant="secondary">Blocked</Badge>
                              )}
                              {getRiskBadge(result.method, result.allowed)}
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              {result.statusCode && (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className={`font-mono ${
                                    result.statusCode < 400 ? 'text-primary' : 'text-muted-foreground'
                                  }`}>
                                    {result.statusCode} {result.statusText}
                                  </span>
                                </div>
                              )}
                              
                              {result.error && (
                                <div className="flex items-center gap-2">
                                  <Warning size={14} weight="duotone" className="text-destructive" />
                                  <span className="text-destructive text-xs">{result.error}</span>
                                </div>
                              )}
                              
                              {result.responseTime && (
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Time:</span>
                                  <span className="font-mono text-xs">{result.responseTime}ms</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Security Recommendations:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Only enable methods that your application actually needs</li>
                    <li>Disable dangerous methods like TRACE, CONNECT if not required</li>
                    <li>Implement proper authentication for PUT, DELETE, PATCH</li>
                    <li>Use web application firewall (WAF) rules to restrict methods</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
