import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  ClockCounterClockwise, 
  GlobeHemisphereWest, 
  Broadcast, 
  Eye, 
  ShieldCheck, 
  Article, 
  IdentificationCard, 
  Tree 
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface ScanHistoryProps {
  history: any[]
  onSelectScan: (scan: any) => void
}

export default function ScanHistory({ history, onSelectScan }: ScanHistoryProps) {
  const { playClickSound } = useSoundEffects()
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <Card className="glow-border h-fit sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClockCounterClockwise className="text-primary" size={20} weight="duotone" />
          Recent Scans
        </CardTitle>
        <CardDescription className="text-xs">
          Your scan history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <ClockCounterClockwise className="mx-auto text-muted-foreground" size={32} weight="duotone" />
            <p className="text-sm text-muted-foreground">No scans yet</p>
            <p className="text-xs text-muted-foreground">Start scanning to build your history</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {history.map((scan, index) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="flex items-start gap-2 mb-2">
                      {scan.type === 'domain' && (
                        <GlobeHemisphereWest className="text-primary flex-shrink-0 mt-0.5" size={16} weight="duotone" />
                      )}
                      {scan.type === 'port' && (
                        <Broadcast className="text-primary flex-shrink-0 mt-0.5" size={16} weight="duotone" />
                      )}
                      {scan.type === 'ssl' && (
                        <ShieldCheck className="text-primary flex-shrink-0 mt-0.5" size={16} weight="duotone" />
                      )}
                      {scan.type === 'headers' && (
                        <Article className="text-primary flex-shrink-0 mt-0.5" size={16} weight="duotone" />
                      )}
                      {scan.type === 'whois' && (
                        <IdentificationCard className="text-primary flex-shrink-0 mt-0.5" size={16} weight="duotone" />
                      )}
                      {scan.type === 'subdomain' && (
                        <Tree className="text-primary flex-shrink-0 mt-0.5" size={16} weight="duotone" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {scan.domain || scan.target || scan.url}
                        </p>
                        {scan.type === 'domain' && scan.result?.ip && (
                          <p className="text-xs font-mono text-muted-foreground truncate">
                            {scan.result.ip}
                          </p>
                        )}
                        {scan.type === 'port' && scan.openPorts !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {scan.openPorts} open ports
                          </p>
                        )}
                        {scan.type === 'ssl' && scan.result?.valid !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {scan.result.valid ? '✓ Valid SSL' : '✗ Invalid SSL'}
                          </p>
                        )}
                        {scan.type === 'headers' && scan.result?.securityScore !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Score: {scan.result.securityScore}%
                          </p>
                        )}
                        {scan.type === 'subdomain' && scan.result?.totalFound !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {scan.result.totalFound} subdomains
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {scan.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatTime(scan.timestamp)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          playClickSound()
                          onSelectScan(scan)
                        }}
                      >
                        <Eye size={14} />
                      </Button>
                    </div>
                  </div>
                  {index < history.length - 1 && <Separator className="my-2" />}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
