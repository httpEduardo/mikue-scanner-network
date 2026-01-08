import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
  CheckCircle,
  ClockCounterClockwise,
  GlobeHemisphereWest
import {
interface DNSS
  provider
}
  Warning,
  GlobeHemisphereWest
} from '@phosphor-icons/react'
}

  { name: 'Quad9', pr
  { name: 'Ope
  { name: 'Verisig
  { name: 'Comodo'
}

  onScanComplete?: (scan: any

  const [domain, setDomain] = useState('')
  const [resu
  const [progress, setP

}


    setProgress(0)

      server,
    }))
    let completedChecks = 0

      const server = DNS_SERVERS[i]

        const mockIp = `${Math.floor(Math.random() * 256)}.${Math.floor(
        await new Promise(resolve => setTimeout(resolve, 500 + M
 



 

        }
        allResults[i] = {
          status: 'failure',
          error: 'Query failed'
      }
      completedChecks++
      setResults([...allResults])

    toast.success('DNS propagation check co
    if (onScanComp
        type: 'dns-propagation',
      return
     


    setProgress(0)
        return <Badge cl

        return <Badge variant="destructive">Failed</Badge>
      server,
  }
    }))
    setResults(allResults)
    let completedChecks = 0
      case 'failure':

    }

  const totalCount = results.lengt

      <Card
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
        
            <CardTitle>DNS Propagation Checker</CardTitle>

      </CardHeader>
        <div className="flex gap-2">
          setExpectedValue(mockIp)
        }

        const matches = mockIp === firstResolvedValue

        allResults[i] = {
          server,
          status: matches ? 'success' : 'mismatch',
          ip: mockIp,
          responseTime: Date.now() - startTime
        }
      } catch (error) {
        allResults[i] = {
          server,
          status: 'failure',
          responseTime: Date.now() - startTime,
          error: 'Query failed'
        }
      }

      completedChecks++
      setProgress((completedChecks / DNS_SERVERS.length) * 100)
      setResults([...allResults])
    }

    setIsChecking(false)
    toast.success('DNS propagation check complete')

    if (onScanComplete) {
      onScanComplete({
        type: 'dns-propagation',
        domain,
        recordType,
        results: allResults,
        expectedValue: firstResolvedValue
      })
    }
  }

  const getStatusBadge = (status: PropagationResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Propagated</Badge>
      case 'mismatch':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Mismatch</Badge>
      case 'failure':
        return <Badge variant="destructive">Failed</Badge>
      case 'checking':
        return <Badge variant="secondary">Checking...</Badge>
    }
  }

  const getStatusIcon = (status: PropagationResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} weight="duotone" />
      case 'mismatch':
        return <Warning className="text-yellow-400" size={20} weight="duotone" />
      case 'failure':
        return <XCircle className="text-destructive" size={20} weight="duotone" />
      case 'checking':
        return <ClockCounterClockwise className="text-muted-foreground animate-spin" size={20} weight="duotone" />
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const totalCount = results.length

  return (
    <Card className="glow-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <GlobeHemisphereWest className="text-primary" size={20} weight="duotone" />
          </div>
          <div>
            <CardTitle>DNS Propagation Checker</CardTitle>
            <CardDescription>Check DNS propagation across multiple nameservers worldwide</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={isChecking}
            className="flex-1"
          />
                 
            value={recordType}
            onChange={(e) => setRecordType(e.target.value as any)}
            disabled={isChecking}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            </ScrollArea>
            <option value="MX">MX</option>

          <Button
            <p className="text-sm">Enter 
            disabled={isChecking}
            className="gap-2"
          >
            {isChecking ? (
              <>
                <ClockCounterClockwise className="animate-spin" size={18} weight="duotone" />
                Checking

            ) : (

                <GlobeHemisphereWest size={18} weight="duotone" />

              </>

          </Button>
        </div>

        {isChecking && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Checking DNS servers...</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>

          </div>


        {results.length > 0 && (
          <div className="space-y-4">
            {expectedValue && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Expected Value</p>
                <p className="font-mono text-sm text-primary font-bold">{expectedValue}</p>

            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Propagation Status</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold">
                  {successCount}/{totalCount}

                {getStatusBadge(successCount === totalCount ? 'success' : successCount > 0 ? 'mismatch' : 'failure')}
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {results.map((result, index) => (

                    key={index}
                    className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium">{result.server.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.server.provider} • {result.server.location}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>

                    {result.ip && (
                      <div className="p-2 rounded bg-muted/50 mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Resolved Value</p>

                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      {result.responseTime !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Response: {result.responseTime}ms

                      )}
                      {result.error && (
                        <p className="text-xs text-destructive">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}

            </ScrollArea>

        )}

        {!isChecking && results.length === 0 && (

            <p className="text-sm">Enter a domain name and select a record type to check DNS propagation</p>

        )}

    </Card>

}
