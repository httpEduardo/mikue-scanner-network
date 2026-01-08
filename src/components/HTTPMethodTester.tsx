import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 

  onScanComplet

  method: 
  status
  error?: strin
}
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

          'Content-Typ
      })
      cle
      co
      retur
        al
        s
      }
      cons
      
 

          responseTime
      }
      if (error.message.includes('Failed to fet
          method,
          error: 'Network/CORS Error',
        }

        method,
        error: error.message || 'Unknow
    
  }
  const testAllMethods = async () => {
    
      toast.error('Pl
      return

    if (!testUrl.startsWith('http://') && !te
    }
    setL
      
    try {
      const allowed: string[] = []
      
        method
        method,
        }
        setResults([...methodResults


      }
          target: url,
          allowedMethods: allowed,
          allowedCount: allowed.length
      
      playSuccessSound()
    } catch (err
      playErrorSo
    } finally {
    }

    const
    
    if
  }
        method,
    
    
      return <Badge 
      }
    }
  }

  const testAllMethods = async () => {
          <Swor
    
          Test 
      </CardHeader>
        <div clas
      return
    }

            disabled=
          />
            onClick={testAllMethods}
     

    setLoading(true)

          <Alert>

    try {
        )}
        {results.length > 0 && (

                <CardContent className="pt
                  <div className="text-xs text-muted-for
        methodResults.push(result)
        
                    {HTTP_MET
                  <div classNa
         

                    {allowedMethods.fi
       



                <AlertDescr
                </AlertD
            )}
            <Separator
            <ScrollArea className
                {results.map((resu
                    <CardContent className="
          allowedCount: allowed.length
          
      }

      playSuccess()
                            )}
                          
                            <div className="flex
                 
                              )}
    } finally {
                       
    }
  }

                                    result.s
                                    {result.statusCode} {re
                                </div>
    
                                <div className="f
                                  <span className=
                
   

                                </div>
                            <
    
                    </CardContent>
    
            </ScrollArea>
            <Alert>
    }
                  <ul classN
                    <li>Disable dangerous methods like TRACE, CONNECT if not required</
     
               
  }

  return (
}
      <CardHeader>



        </CardTitle>















          />

            onClick={testAllMethods} 









          <Alert>



            </AlertDescription>





































            )}





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
