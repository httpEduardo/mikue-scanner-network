import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 

  const testMethod = asy
    
      const response = await fetch(url, {
   

      
        method,
    
        r
    } catch (err) {
        method,
        error: 'Netw
    }

    if (!testUrl.trim()) {
      
    }
    playClickSo
    setResults([])
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
        </Badge>
    } finally {
    return null
    }
  }

        <CardTitle className="flex items-center gap-3">
            <Sword size={24} 
    
        <CardDescription>
    
      <CardContent classNa
          <Inp
            placeholder="Enter URL (e.g., https://examp
            onChange={(e) => setTestUrl(e.target
            disable
          />
       
    }
    
          </Button>

          <div className="space-y-4">
              <div className="p-4 rounded-lg bg-
                <div cl
              <d
       
    }
    
               
  }

                      <div className="flex items-center

  return (
                        <div>
      <CardHeader>
                              Status: {result.statusCod
                          )}
                      </div>
                
                          {r
        </CardTitle>
                    
                      {result.responseTime !== undefined && (
                          
                   
                        <div className="t
                        </div>
                
                ))}
            </ScrollArea>
            {allowedMethods
                <Warning size={16} weight="duotone" />
                  Found {allowedMethods.length} allowed HTTP method{
                    <span clas
                    </span>
          />
            )}
            onClick={testAllMethods}
    </Card>
}





















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
