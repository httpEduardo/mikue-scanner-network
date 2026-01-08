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
      
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] opacity-[0.08] pointer-events-none">
        <div className="relative w-full h-full">
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <defs>
              <linearGradient id="mikuHair" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'oklch(0.65 0.15 195)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'oklch(0.55 0.18 200)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="mikuSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'oklch(0.90 0.05 50)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'oklch(0.85 0.05 40)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            
            <ellipse cx="200" cy="180" rx="80" ry="95" fill="url(#mikuSkin)" />
            
            <ellipse cx="180" cy="170" rx="8" ry="12" fill="oklch(0.30 0.05 210)" />
            <ellipse cx="220" cy="170" rx="8" ry="12" fill="oklch(0.30 0.05 210)" />
            
            <path d="M 185 195 Q 200 200 215 195" stroke="oklch(0.70 0.20 340)" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            <path d="M 140 120 Q 120 80 130 50 Q 140 20 160 15 Q 180 10 200 10 Q 220 10 240 15 Q 260 20 270 50 Q 280 80 260 120 L 250 150 Q 240 170 220 175 L 200 180 L 180 175 Q 160 170 150 150 Z" fill="url(#mikuHair)" />
            
            <ellipse cx="100" cy="140" rx="20" ry="80" fill="url(#mikuHair)" transform="rotate(-10 100 140)" />
            <ellipse cx="300" cy="140" rx="20" ry="80" fill="url(#mikuHair)" transform="rotate(10 300 140)" />
            
            <path d="M 150 200 L 140 260 Q 138 280 145 300 L 160 350 L 155 400 Q 154 420 160 440 L 165 480" stroke="oklch(0.75 0.10 210)" strokeWidth="35" fill="none" strokeLinecap="round" />
            <path d="M 250 200 L 260 260 Q 262 280 255 300 L 240 350 L 245 400 Q 246 420 240 440 L 235 480" stroke="oklch(0.75 0.10 210)" strokeWidth="35" fill="none" strokeLinecap="round" />
            
            <rect x="155" y="240" width="90" height="120" fill="oklch(0.30 0.05 210)" rx="8" />
            
            <circle cx="200" cy="160" r="15" fill="oklch(0.70 0.20 340)" opacity="0.3" />
            <circle cx="220" cy="145" r="8" fill="oklch(0.70 0.20 340)" opacity="0.3" />
            <circle cx="180" cy="145" r="8" fill="oklch(0.70 0.20 340)" opacity="0.3" />
          </svg>
        </div>
      </div>
      
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
