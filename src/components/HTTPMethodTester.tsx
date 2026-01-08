import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MagnifyingGlass, 
  CheckCircle, 
  XCircle, 
  Warning,
  Sword,
  ShieldWarning
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

const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
  'TRACE',
  'CONNECT'
]

export default function HTTPMethodTester({ onScanComplete }: HTTPMethodTesterProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MethodResult[]>([])
  const [allowedMethods, setAllowedMethods] = useState<string[]>([])
  const { playClickSound, playSuccessSound, playErrorSound } = useSoundEffects()

  const testMethod = async (url: string, method: string): Promise<MethodResult> => {
    const startTime = performance.now()
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(url, {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      clearTimeout(timeoutId)
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)
      
      return {
        method,
        allowed: response.ok || (response.status >= 200 && response.status < 500),
        statusCode: response.status,
        statusText: response.statusText,
        responseTime
      }
    } catch (error: any) {
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)
      
      if (error.name === 'AbortError') {
        return {
          method,
          allowed: false,
          error: 'Request timeout',
          responseTime
        }
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return {
          method,
          allowed: false,
          error: 'Network/CORS Error',
          responseTime
        }
      }
      
      return {
        method,
        allowed: false,
        error: error.message || 'Unknown error',
        responseTime
      }
    }
  }

  const testAllMethods = async () => {
    playClickSound()
    
    if (!url) {
      toast.error('Please enter a URL')
      playErrorSound()
      return
    }

    let testUrl = url
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = 'https://' + testUrl
    }

    setLoading(true)
    setResults([])
    setAllowedMethods([])

    try {
      const methodResults: MethodResult[] = []
      const allowed: string[] = []

      for (const method of HTTP_METHODS) {
        const result = await testMethod(testUrl, method)
        methodResults.push(result)
        
        if (result.allowed) {
          allowed.push(method)
        }

        setResults([...methodResults])
      }

      setAllowedMethods(allowed)

      if (onScanComplete) {
        onScanComplete({
          type: 'http-methods',
          target: url,
          results: methodResults,
          allowedMethods: allowed,
          totalMethods: HTTP_METHODS.length,
          allowedCount: allowed.length
        })
      }

      playSuccessSound()
      toast.success(`Test completed! ${allowed.length}/${HTTP_METHODS.length} methods allowed`)
    } catch (error: any) {
      toast.error('Failed to test HTTP methods')
      playErrorSound()
      console.error('HTTP method test error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevel = (method: string) => {
    const dangerous = ['PUT', 'DELETE', 'TRACE', 'CONNECT']
    const moderate = ['POST', 'PATCH']
    
    if (dangerous.includes(method)) return 'high'
    if (moderate.includes(method)) return 'medium'
    return 'low'
  }

  const getRiskBadge = (method: string, allowed: boolean) => {
    if (!allowed) return null
    
    const risk = getRiskLevel(method)
    
    if (risk === 'high') {
      return <Badge variant="destructive" className="text-xs">High Risk</Badge>
    }
    if (risk === 'medium') {
      return <Badge variant="default" className="text-xs bg-accent">Medium Risk</Badge>
    }
    return null
  }

  return (
    <Card className="glow-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sword size={24} weight="duotone" className="text-primary" />
          HTTP Method Tester
        </CardTitle>
        <CardDescription>
          Test which HTTP methods are allowed on a target URL (domain or IP)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            id="http-method-url"
            type="text"
            placeholder="example.com, https://example.com or https://8.8.8.8"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && testAllMethods()}
            disabled={loading}
            className="font-mono"
          />
          <Button 
            onClick={testAllMethods} 
            disabled={loading || !url}
            className="gap-2"
          >
            <MagnifyingGlass size={18} weight="duotone" />
            {loading ? 'Testing...' : 'Test'}
          </Button>
        </div>

        {loading && (
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Testing HTTP methods... {results.length}/{HTTP_METHODS.length}
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Card className="bg-card/50">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-primary">{allowedMethods.length}</div>
                  <div className="text-xs text-muted-foreground">Allowed Methods</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {HTTP_METHODS.length - allowedMethods.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Blocked Methods</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-accent">
                    {allowedMethods.filter(m => getRiskLevel(m) === 'high').length}
                  </div>
                  <div className="text-xs text-muted-foreground">High Risk</div>
                </CardContent>
              </Card>
            </div>

            {allowedMethods.filter(m => getRiskLevel(m) === 'high').length > 0 && (
              <Alert variant="destructive">
                <ShieldWarning size={18} weight="duotone" />
                <AlertDescription>
                  Warning: Dangerous HTTP methods are allowed! Methods like PUT, DELETE, TRACE, or CONNECT can be security risks.
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-3">
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
