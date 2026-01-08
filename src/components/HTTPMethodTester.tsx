import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Sword,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Warning,
  ShieldCheck,
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
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)

      return {
        method,
        allowed: response.ok || response.status < 500,
        statusCode: response.status,
        statusText: response.statusText,
        responseTime,
      }
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        return {
          method,
          allowed: false,
          error: 'Network/CORS Error',
        }
      }
      return {
        method,
        allowed: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  const testAllMethods = async () => {
    if (!testUrl.trim()) {
      toast.error('Please enter a URL')
      playErrorSound()
      return
    }

    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      toast.error('URL must start with http:// or https://')
      playErrorSound()
      return
    }

    playClickSound()
    setLoading(true)
    setResults([])
    
    try {
      const methodResults: MethodResult[] = []
      const allowed: string[] = []
      
      for (const method of HTTP_METHODS) {
        const result = await testMethod(method, testUrl)
        methodResults.push(result)
        setResults([...methodResults])
        
        if (result.allowed) {
          allowed.push(method)
        }
      }

      if (onScanComplete) {
        onScanComplete({
          type: 'http-methods',
          target: testUrl,
          allowedMethods: allowed,
          allowedCount: allowed.length,
        })
      }
      
      playSuccessSound()
      toast.success(`Test complete! ${allowed.length} methods allowed`)
    } catch (err) {
      playErrorSound()
      toast.error('Failed to test methods')
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (method: string, allowed: boolean) => {
    if (!allowed) return null
    
    const dangerousMethods = ['TRACE', 'CONNECT', 'DELETE']
    const sensitiveMethods = ['PUT', 'PATCH']
    
    if (dangerousMethods.includes(method)) {
      return <Badge variant="destructive" className="gap-1">
        <Warning size={12} weight="duotone" />
        High Risk
      </Badge>
    }
    
    if (sensitiveMethods.includes(method)) {
      return <Badge variant="secondary" className="gap-1">
        <ShieldWarning size={12} weight="duotone" />
        Moderate Risk
      </Badge>
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
            id="http-method-url"
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
            {loading ? 'Testing...' : 'Test All'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-muted-foreground">
                    Testing {HTTP_METHODS.length} HTTP methods...
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default" className="gap-1">
                      <CheckCircle size={12} weight="duotone" />
                      {allowedMethods.length} Allowed
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <XCircle size={12} weight="duotone" />
                      {results.length - allowedMethods.length} Blocked
                    </Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Separator />

            <ScrollArea className="h-[500px] pr-4">
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
