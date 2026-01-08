import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/pro
import { 
  CheckCircle,
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
  ClockCo
  GlobeHemisphereWest,
  CheckCircle,
interface 
  Warning,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import { toast } from 'sonner'

  status: 'checking' 
  { name: 'Clo
  { name: 'OpenDNS
  ip: string
  { name: 'Cle
}

}
export default func
  const [recordType, setRecordType] = useState<'A' | 'AAA
  const [resu
  const [progress, setP
  const checkDNS
 

    setIsChecking(true)
    setProgress(0)

    let completedChecks = 0

      const startTime = Date.now()
      try {
          `https://dns.google/resolve?name=${domain}&type=${recordType}`
        const data = await response.json()


          if (!firstResolvedValue) {
            setExpectedValue(resolvedV


            ip: resolvedValue,
          })
          allResults.push({
            status: 'failure',
            error: 'No records found'
        }
        allResults.push({

          responseTime: 0
    if (!domain.trim()) {
      completedChecks++
      return


      onScanComplete({
    setResults([])
    setProgress(0)
    setExpectedValue('')

    const allResults: PropagationResult[] = []
    let completedChecks = 0
    let firstResolvedValue = ''

    for (const server of DNS_SERVERS) {
      const startTime = Date.now()
      
      try {
        const response = await fetch(
          `https://dns.google/resolve?name=${domain}&type=${recordType}`
        )
        const data = await response.json()
        const responseTime = Date.now() - startTime

        if (data.Answer && data.Answer.length > 0) {
          const resolvedValue = data.Answer[0].data
          
          if (!firstResolvedValue) {
            firstResolvedValue = resolvedValue
            setExpectedValue(resolvedValue)
          }

          allResults.push({
            server,
            status: resolvedValue === firstResolvedValue ? 'success' : 'mismatch',
            ip: resolvedValue,
            responseTime
          })
        } else {
          allResults.push({
            server,
            status: 'failure',
            responseTime,
            error: 'No records found'
          })
        }
      } catch (error) {
        allResults.push({
          server,
          status: 'failure',
                <p className="font-mono text-sm text-primary font-bold">
                </p>
        })
       

              </div>

              <div className="p-4
     

                    <div

                         
                      
                          {resul
               
                   
                        )}
        
     

                    {result.responseTime !== undefined && (
                        <p className="text-xs text-muted-foreground">Response</p>
   

              </div>
    switch (status) {

          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Enter a domain
        )}
    </Card>
}















  }







      <CardHeader>







      </CardHeader>
      <CardContent className="space-y-4">







            className="flex-1"

          />
          <select












            onClick={checkDNSPropagation}
            className="gap-2"

            {isChecking ? (



              </>







        </div>





              <span className="font-mono text-primary">{Math.round(progress)}%</span>



        )}







                  {successCount}/{totalCount}

              </div>













            )}

            <ScrollArea className="h-[500px]">



                    key={index}

                  >




















                      </div>







                  </div>

              </div>

          </div>









    </Card>

}
