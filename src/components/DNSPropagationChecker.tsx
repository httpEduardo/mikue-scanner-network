import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/butto
import { ScrollArea } from '@/components/ui/scr
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  GlobeHemisphereWest,
  CheckCircle,
  XCircle,
  ClockCounterClockwise,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'

  ip: string
}
interface Propagat
  status: 'c
  error?: stri
}

  { name: 'Cloudflare', locat
  { name: 'OpenDNS'
  { name: 'Comodo', location: 'USA', ip: '8.26.56.26', fl
  { name: 'Ve
  { name: 'Clean

 

  const [results, setResults] = us

    if (!domain.trim()) {
      return

    setProgress(0)
    setExpectedValue('')
    const initialResults: PropagationResult[] = DNS_SERVERS.map(server => ({
      status: 'checking' as const
    setResults(initialResults)
    const allResults: PropagationResult[] = []


      try {
        
          `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType
        
        const responseTime = Math.round(endTi
        if (!response.ok) {
        }

        let resolvedValue = ''
        if (data.Answer &
            resolvedValue = data.Answer[0].data
            
     


            setExp

          

            ip: resolvedValue,
      server,
      status: 'checking' as const
    }))
    setResults(initialResults)

    const allResults: PropagationResult[] = []
    let completedChecks = 0

    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const server = DNS_SERVERS[i]
      
      try {
        const startTime = performance.now()
        
        const response = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}&cd=false`
        )
        
        const endTime = performance.now()
        const responseTime = Math.round(endTime - startTime)
        
        if (!response.ok) {
          throw new Error('DNS query failed')
        }

        const data = await response.json()
        
        let resolvedValue = ''
        
        if (data.Answer && data.Answer.length > 0) {
          if (recordType === 'A' || recordType === 'AAAA') {
            resolvedValue = data.Answer[0].data
          } else if (recordType === 'CNAME') {
            resolvedValue = data.Answer[0].data
          } else if (recordType === 'MX') {
            resolvedValue = data.Answer.map((a: any) => `${a.data} (${a.priority || 'N/A'})`).join(', ')
          } else if (recordType === 'TXT') {
            resolvedValue = data.Answer.map((a: any) => a.data).join(', ')
          }

          if (!expectedValue) {
            setExpectedValue(resolvedValue)
          }

          const status = !expectedValue || resolvedValue === expectedValue ? 'success' : 'mismatch'
          
          allResults[i] = {
            server,
            status,
            ip: resolvedValue,
            responseTime
          }
        } else {
          allResults[i] = {
            server,
            status: 'failure',
            error: 'No records found',
            responseTime
          }
        }
      } catch (error) {
        allResults[i] = {
          server,
          status: 'failure',
    switch (status) {
        return <Badge var
        r
       

  }
  const successCount = results.filter(r => r.status === 'succes
  const propagationPercentage = t
  retu
      <CardHeader>
     

            <div>

          </div>
      </CardHeader>
      <CardContent className="space-y-4">

            placeholder="
            onChange={
            className="flex-1"
          />
          <select
            onChange={(e) => s
            className="px-4
        
     

          
            onClick={checkDNSPropagation} 
            className="gap-2"
            {isChecking ? (
            
              </>
     
   

        </div>
        {isChecking &
            <div class
              <span className="font-mono text-primary">{Math.round(progress)}%</span>
            <Progress
        )}
        {results.leng
            <div className="flex items-center justify-between p-4 rounded-lg bg-mu
                <p cla
                  {successCount} / {totalCount}
     
   

              </div>

              <div cla
                <p className="font-mono text-sm text-primary 
            )}
            <ScrollArea className="h-[400px] rounded-lg border border-border">
                {resu
                    key={index}
                  >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
     
   

                            {getStatusBadge(result.status)}
                          <div clas
                              {result.server.location} • {result.server.ip}

          
                            )}
                  
                              </p>
                          </div>
                      </div>
                        <div className="text-right shrink-0">
                  
                 
                  </div>
              </div>
          </div>

          <div
            <p clas
      
    </Card>
}







































































































































