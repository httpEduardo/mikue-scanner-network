import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scr
import { 
  MagnifyingGlass,
  XCircle,
  ShieldCheck,
} from '@
import {
interface HTTPMeth
}
interface 
  allowed:
  statusText?:
  responseTime?

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

          allowed: false,

      return {
        allowed: false,
      }
  }
  const testAllMethods = async () => {

      return

      toa
      return

    setLoading(true)
    
      const methodResults: MethodResult[] = [
      
      })
      
        if (result.allowed) {
        }

        onScan
          targe
          allowedCount: allowed.length,
      }
      playSuccessSound()
    } catch (err) {
      }
      setLoading(false)
  }
  const getRiskB
          method,
    const sensitiveMethod
          error: 'Network/CORS Error',
        }
      <
    
        method,
        Moderate Risk
    }
    ret

  }

  const testAllMethods = async () => {
            <Sword size={2
          HTTP Method Tester
        <CardDescripti
      return
    }

            placeholder="Enter URL (e.g., https://example.com or https://8.8
            onChange={(e) => setTestUrl(e.target.value)}
            disabled={
          />
     

            <Magnify
          </Button>

    
    try {
                  <div className="text-xs text
      const allowed: string[] = []
      
                      {allowedMethods.leng
                    <Badge variant="secondary" className
                      {results.len
                  </div>
        


        }
      }

                          <
                        
                          }`}>
                          
          allowedMethods: allowed,
                          </div>
          
       
      
      playSuccessSound()
                              )}
                   
                      
                                <div classN
    } finally {
                       
    }
  }

                                  <Warning size={14} weight="d
                             
    
                                <div className="flex items-
                                  <span class
    
                          </div>
                      </div>
                  </Card>
              </d

    }
    
                    <li>Only enable methods 
                    <li>Implement proper authentication fo
                  </ul>
              </Alert
          </di
    }
  )

  }



  return (

      <CardHeader>





        </CardTitle>














          />

            onClick={testAllMethods} 


































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
