import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
import { Badge } from '@/components/ui/badge'
} from '@
import { motion, Anima
import { useSo
interface 
  Warning

  server: DNSServer
import { motion, AnimatePresence } from 'framer-motion'
import MikuCharacter from './MikuCharacter'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface DNSServer {
const DNS_SERV
  provider: string
  { name: 'Quad9',
}

  { name: 'NextDNS', provider
  { name: 'OpenNIC'
  { name: 'Hurricane Electric', provider: 'HE.net', locat
]
interface DNSPropagatio
}
e

  const [results, setResults] = us
  const [expectedValue, setExpectedValue] = useState('')

    const cleanDomain = domain.replace(/^https?:\/\//, '').
    
      toast.error('Please enter a valid domain name')
      return

    setResults(DNS_SERVERS.map(server => ({
      status: 'checking' as const
    setProgress(0)
    playScanStartSound()
    const allResults: PropagationResult[] = []

      const server = DNS_SERVERS[i]
      await new Promise(resolve => setTimeout(resolve, 150 + Ma
      try {
        const mockIp = `${Math.floor(Math.random() * 256)}.${Ma
        if (firstResolvedValue === '') {
          setExpectedValue(mockIp)

 

          status: isMismatch ? 'mismat
          responseTime
 

          error: 'Connection timeout'
      }
      setResults([...allResults])
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<PropagationResult[]>([])
  const [progress, setProgress] = useState(0)
  const [expectedValue, setExpectedValue] = useState('')
      toast.success(`DNS fully propagated across all ${DNS_SERVERS.length} servers!`)

  const handleCheck = async () => {
        results: allResults,
      })

  }
  const handleKeyPress = (e: React.KeyboardEvent) => 
      handleCheck()
  }
  con

    setIsChecking(true)
    setResults(DNS_SERVERS.map(server => ({
      server,
      status: 'checking' as const
    })))
    }

    const colors: Record

    const allResults: PropagationResult[] = []
    let firstResolvedValue = ''

    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const server = DNS_SERVERS[i]
      
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200))

      try {
        const startTime = Date.now()
        const mockIp = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
        
        if (firstResolvedValue === '') {
          firstResolvedValue = mockIp
            <select
         

              <option value="A">A</option>
              <option value="CNAME">CNAME</option>

            <Button 
                p
              }} 
              className="gap-2"
              {isCheck
         
                </>
                <>
                 
              )}
          </div>
         
       

              <Progress value={pr
          )}
     

          <motion.div
            animate={{ opacity: 1, y: 0 }}

            <MikuCharacter 
        )}
        {results.length 
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            <Card className="glow-border bg-card/50 backdrop-blur">
            
                    <GlobeHemisphereWest size={24} weight="duotone" />
     

                  </div>
                {expec
                    Expected: {e
                )}
              <Card
                  <div class
                      <motion
        
     

                        
   

                            </div>
                              {result.serve
                   

   

                                <p className="text-xs text-muted-fo
                     
                      
                          {result.error && (
                     
                        </div>
                    ))
                </ScrollArea>
            </Card>
        )}
     
   

      </AnimatePresence>
  )


























































































          >









          >


































































        )}




            <p>Enter a domain name to check DNS propagation</p>
          </div>



  )

