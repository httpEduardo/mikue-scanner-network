import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scr
  GlobeHemisphereWest,
  XCircle,
  ClockCounterClockwise
import { 
interface DNSServer {
  provider: st
}
  Warning,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DNSServer {
  name: string
  provider: string
  location: string
 

interface PropagationResult {
  server: DNSServer
  status: 'checking' | 'success' | 'mismatch' | 'failure'
  ip?: string
  responseTime?: number
  error?: string
}

const DNS_SERVERS: DNSServer[] = [
  { name: 'Google DNS', provider: 'Google', location: 'Global' },
  { name: 'Cloudflare', provider: 'Cloudflare', location: 'Global' },
  { name: 'Quad9', provider: 'Quad9', location: 'Global' },
  { name: 'OpenDNS', provider: 'Cisco', location: 'Global' },
  { name: 'Level3', provider: 'Level3', location: 'US' },
  { name: 'Verisign', provider: 'Verisign', location: 'Global' },
  { name: 'Comodo', provider: 'Comodo', location: 'Global' },
  { name: 'DNS.WATCH', provider: 'DNS.WATCH', location: 'Germany' }
]

interface DNSPropagationCheckerProps {
  onScanComplete?: (scan: any) => void
}

export default function DNSPropagationChecker({ onScanComplete }: DNSPropagationCheckerProps) {
  const [domain, setDomain] = useState('')
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX'>('A')
  const [results, setResults] = useState<PropagationResult[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [expectedValue, setExpectedValue] = useState<string>('')

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain')
      setPro
    }

    setIsChecking(true)
      onScanComple

    const allResults: PropagationResult[] = DNS_SERVERS.map(server => ({
    }
      status: 'checking' as const
    swi
        return <Badge clas

      case 'failure':
    let firstResolvedValue = ''

    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const server = DNS_SERVERS[i]
      const startTime = Date.now()
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700))
  }
        const mockIp = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        
        if (!firstResolvedValue) {
          firstResolvedValue = mockIp
            <GlobeHemisphereWest c
         

        </div>

          <Input
            value
            disabled={isChecking}
          />
            value={recordType}
         
          >
            <option value
            <opti
          <Button
            disabled={isChecking}
          >
         
       

                <GlobeH
              </>
          </Button>


            <div classNa
              <span className="text-muted-foregroun


          <div classNa
              <div className="p-
               
            )}
            <div className="
              <div className="flex items-
        
     
   

                {results.map((result, index) => (
                    k
                  >
                      <div className="flex items-center gap-3">
                      
                          <p className="text-xs text-muted-foreground">
                     
                      </div>
                    </
                    {result.ip && (
     
   

                      {result.responseTime !== undefined && (
                     
                     
                        <p className="text-destructive">{result.error}</p>
                    </
                ))}
            </ScrollA
        )}
        {!isChecking &
            <p className="text-sm">Enter a domain name and select a record type to check DNS propagation</p>
     
   


























          <select







            <option value="CNAME">CNAME</option>

          </select>

            onClick={handleCheck}







              </>

              <>

                Check

            )}









            </div>

        )}







              </div>







                </span>







                  <div



















                        <p className="font-mono text-sm">{result.ip}</p>





                        <p className="text-muted-foreground">

                        </p>


                        <p className="text-destructive">{result.error}</p>




              </div>

          </div>



          <div className="text-center py-12 text-muted-foreground">

          </div>

      </CardContent>

  )

