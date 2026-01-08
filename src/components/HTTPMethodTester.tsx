import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/butto
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/co
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 

  onScanComplete?:

  method: 
  statusCo
  error?: string
}
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATC

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

        allowed: false,

export default function HTTPMethodTester({ onScanComplete }: HTTPMethodTesterProps) {
  const [testUrl, setTestUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MethodResult[]>([])
    playClickSound()

    try {
      if (!targetUrl.startsWith('http:/
    
      con
      const response = await fetch(url, {
        method,



      
          target: targetUrl,
      
          tota
      }
      playSuccessSound()
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

    } finally {

    }
  }



  return (

      <CardHeader>



        </CardTitle>











          />

            onClick={testAllMethods}












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
