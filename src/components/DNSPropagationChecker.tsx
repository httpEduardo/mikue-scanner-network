import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigge
import { GlobeHemisphereWest, MagnifyingGlass
import MikuCharacter from './MikuCharacter'

  name: string
  location: string
}
const DNS_SERVERS: DNSServer[] = [
  { name: 'Cloudflare Secondary', provider: 'Cloudflare', l

  { name: 'OpenDNS Pr
  { name: 'Lev
  provider: string
  location: string
  ip: string
}

const DNS_SERVERS: DNSServer[] = [
  { name: 'Cloudflare Primary', provider: 'Cloudflare', location: 'Global', ip: '1.1.1.1' },
  { name: 'Cloudflare Secondary', provider: 'Cloudflare', location: 'Global', ip: '1.0.0.1' },
  { name: 'Google Primary', provider: 'Google', location: 'Global', ip: '8.8.8.8' },
  { name: 'Google Secondary', provider: 'Google', location: 'Global', ip: '8.8.4.4' },
  { name: 'Quad9', provider: 'Quad9', location: 'Global', ip: '9.9.9.9' },
  { name: 'OpenDNS Primary', provider: 'Cisco', location: 'Global', ip: '208.67.222.222' },
  { name: 'OpenDNS Secondary', provider: 'Cisco', location: 'Global', ip: '208.67.220.220' },
  { name: 'Level3', provider: 'Level3', location: 'US', ip: '209.244.0.3' },
  { name: 'Verisign', provider: 'Verisign', location: 'US', ip: '64.6.64.6' },
  { name: 'DNS.WATCH', provider: 'DNS.WATCH', location: 'Germany', ip: '84.200.69.80' },
  { name: 'Comodo Secure', provider: 'Comodo', location: 'Global', ip: '8.26.56.26' },
  { name: 'Hurricane Electric', provider: 'HE', location: 'US', ip: '74.82.42.42' },
 

    if (!domain.trim()) {
  server: DNSServer
    }
  value?: string
    
  error?: string
 

    setProgress(0)
  onScanComplete?: (scan: any) => void


export default function DNSPropagationChecker({ onScanComplete }: DNSPropagationCheckerProps) {
  const [domain, setDomain] = useState('')
      
          responseTime
      } catch (error) {
          server,
          error: 'Connection timeout'
      }

    }
    setIsChecking(false)
    
    if (allM
    }


    
        domain: cleanDo
        results: allResults,
    }

    if (
    }

    const colors: Record

      mismatch: 'bg-yellow-500/20 text-yellow-
    return colors[status]

    switch (status) {
        return <Clock size={16} wei
      
        return <XCircle size={16} weight="duotone" />

  }
  return (
      <Card className="glow-border bg-card/50 backdrop-blur">
        
            DNS Propagation Checker
          <CardDescription>
          </CardDescription>
        <

              placeholder="example.com"
              onChange={(e) => setDomain(e.targ
              disabled={isChecking}

              <SelectTrig
              </S
                <SelectItem value="A">A</SelectItem>
                <SelectItem val
                <Selec
          
            <Button 
              disabled={i
            >
                <>
                  Checking...
          
       

            </Button>

     

              </p>
          )}
    
      <AnimatePresence mode="wait">
          <motion.d
            initial={{ opacity: 0, y: 20 }}
            
          >
            <p className="mt-4 text-muted-foreground">Enter a domain name
     

            key="results"
            animate={{
          >
              <CardHeader>
                  <
                    Propagat
        
     
   

                )}
              <CardContent>
                  <
     
   

                      >
                          <div className="flex-1 space-y-2">
                              <Badge className={`gap-1.5 ${getStat
                                {result.status}
                              <div>
                                <p className="text-xs text-muted-foregr
     
                         
   

                            {result.error && (
                     
                      
                              <p className="text-xs text-muted-foreground">R
                     
                        </div>
                    
                </ScrollArea>
            </Card>
        )}
    <
}














































                </>

                <>



              )}

          </div>








          )}





          <motion.div
            key="empty"

            animate={{ opacity: 1, y: 0 }}






        )}



            key="results"
            initial={{ opacity: 0, y: 20 }}

            exit={{ opacity: 0, y: -20 }}

            <Card className="glow-border bg-card/50 backdrop-blur">














                )}

























                            </div>















                        </div>



                </ScrollArea>

            </Card>

        )}
      </AnimatePresence>

  )

