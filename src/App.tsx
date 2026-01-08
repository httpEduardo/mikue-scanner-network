import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  GlobeHemisphereWest, 
  Broadcast, 
  WifiHigh, 
  ClockCounterClockwise,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  LockKey,
  LockKeyOpen,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import MikuCharacter from '@/components/MikuCharacter'
import DomainLookup from '@/components/DomainLookup'
import PortScanner from '@/components/PortScanner'
import NetworkInfo from '@/components/NetworkInfo'
import ScanHistory from '@/components/ScanHistory'

function App() {
  const [activeTab, setActiveTab] = useState('lookup')
  const [history, setHistory] = useKV<any[]>('scan-history', [])

  const addToHistory = (scan: any) => {
    setHistory((current) => {
      const currentHistory = current || []
      const newHistory = [
        {
          ...scan,
          timestamp: Date.now(),
          id: Date.now().toString()
        },
        ...currentHistory
      ].slice(0, 20)
      return newHistory
    })
  }

  return (
    <div className="min-h-screen bg-background cyber-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-border">
                <WifiHigh className="text-primary" size={24} weight="duotone" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight glow-text">Miku Network Scanner</h1>
                <p className="text-xs text-muted-foreground">Powered by Hatsune Miku 💙</p>
              </div>
            </div>
            <div className="hidden md:block">
              <MikuCharacter mood="happy" size="small" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="lookup" className="gap-2">
                    <GlobeHemisphereWest size={18} weight="duotone" />
                    <span className="hidden sm:inline">Domain Lookup</span>
                  </TabsTrigger>
                  <TabsTrigger value="ports" className="gap-2">
                    <Broadcast size={18} weight="duotone" />
                    <span className="hidden sm:inline">Port Scanner</span>
                  </TabsTrigger>
                  <TabsTrigger value="network" className="gap-2">
                    <WifiHigh size={18} weight="duotone" />
                    <span className="hidden sm:inline">My Network</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="lookup" className="mt-0">
                  <DomainLookup onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="ports" className="mt-0">
                  <PortScanner onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="network" className="mt-0">
                  <NetworkInfo />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <ScanHistory history={history || []} onSelectScan={(scan) => {
                if (scan.type === 'domain') {
                  setActiveTab('lookup')
                } else if (scan.type === 'port') {
                  setActiveTab('ports')
                }
                toast.info('Scan loaded from history')
              }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
