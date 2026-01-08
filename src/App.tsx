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
  Warning,
  ShieldCheck,
  Article,
  IdentificationCard,
  Tree,
  Database,
  Robot,
  Code
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import MikuCharacter from '@/components/MikuCharacter'
import DomainLookup from '@/components/DomainLookup'
import PortScanner from '@/components/PortScanner'
import NetworkInfo from '@/components/NetworkInfo'
import ScanHistory from '@/components/ScanHistory'
import DancingWaifus from '@/components/DancingWaifus'
import SSLChecker from '@/components/SSLChecker'
import HeadersAnalyzer from '@/components/HeadersAnalyzer'
import WhoisLookup from '@/components/WhoisLookup'
import SubdomainFinder from '@/components/SubdomainFinder'
import DNSRecords from '@/components/DNSRecords'
import RobotsTxt from '@/components/RobotsTxt'
import TechStack from '@/components/TechStack'

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
      
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-primary/10 animate-float blur-xl" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-accent/10 animate-float blur-xl" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-secondary/10 animate-float blur-xl" style={{ animationDelay: '2s' }} />
      
      <div className="absolute right-0 bottom-0 w-[700px] h-[700px] opacity-[0.12] pointer-events-none">
        <div className="relative w-full h-full">
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <defs>
              <linearGradient id="mikuHairBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'oklch(0.70 0.18 195)', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'oklch(0.65 0.20 197)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'oklch(0.58 0.22 200)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="mikuSkinBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'oklch(0.95 0.02 50)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'oklch(0.88 0.03 45)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="mikuOutfitBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'oklch(0.78 0.12 210)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'oklch(0.70 0.14 215)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="mikuTieBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'oklch(0.35 0.08 210)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'oklch(0.25 0.10 215)', stopOpacity: 1 }} />
              </linearGradient>
              <radialGradient id="mikuBlushBg">
                <stop offset="0%" style={{ stopColor: 'oklch(0.75 0.15 20)', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: 'oklch(0.75 0.15 20)', stopOpacity: 0 }} />
              </radialGradient>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <ellipse cx="200" cy="180" rx="85" ry="100" fill="url(#mikuSkinBg)" />
            
            <path 
              d="M 140 120 Q 120 75 125 45 Q 130 15 150 8 Q 170 0 200 0 Q 230 0 250 8 Q 270 15 275 45 Q 280 75 260 120 L 253 155 Q 245 175 225 182 L 200 188 L 175 182 Q 155 175 147 155 Z" 
              fill="url(#mikuHairBg)"
              filter="url(#softGlow)"
            />
            
            <path 
              d="M 135 100 Q 125 110 115 125 Q 105 140 100 160 Q 98 180 102 200 L 108 230"
              stroke="url(#mikuHairBg)"
              strokeWidth="38"
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M 265 100 Q 275 110 285 125 Q 295 140 300 160 Q 302 180 298 200 L 292 230"
              stroke="url(#mikuHairBg)"
              strokeWidth="38"
              fill="none"
              strokeLinecap="round"
            />
            
            <ellipse cx="170" cy="175" rx="10" ry="14" fill="oklch(0.20 0.05 210)" />
            <ellipse cx="230" cy="175" rx="10" ry="14" fill="oklch(0.20 0.05 210)" />
            
            <circle cx="173" cy="172" r="3" fill="oklch(0.90 0.02 0)" opacity="0.6" />
            <circle cx="233" cy="172" r="3" fill="oklch(0.90 0.02 0)" opacity="0.6" />
            
            <ellipse cx="160" cy="195" rx="12" ry="10" fill="url(#mikuBlushBg)" />
            <ellipse cx="240" cy="195" rx="12" ry="10" fill="url(#mikuBlushBg)" />
            
            <path d="M 185 205 Q 200 212 215 205" stroke="oklch(0.70 0.20 340)" strokeWidth="4" fill="none" strokeLinecap="round" />
            
            <rect x="155" y="250" width="90" height="130" fill="url(#mikuOutfitBg)" rx="10" />
            
            <rect x="170" y="260" width="25" height="15" fill="oklch(0.30 0.05 210)" rx="3" />
            <rect x="205" y="260" width="25" height="15" fill="oklch(0.30 0.05 210)" rx="3" />
            
            <path d="M 200 278 L 190 310 L 200 340 L 210 310 Z" fill="url(#mikuTieBg)" />
            
            <path 
              d="M 155 290 L 145 340 Q 142 360 148 385 L 160 425 L 155 465 Q 154 485 160 500"
              stroke="oklch(0.30 0.05 210)"
              strokeWidth="42"
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M 245 290 L 255 340 Q 258 360 252 385 L 240 425 L 245 465 Q 246 485 240 500"
              stroke="oklch(0.30 0.05 210)"
              strokeWidth="42"
              fill="none"
              strokeLinecap="round"
            />
            
            <circle cx="145" cy="80" r="12" fill="oklch(0.70 0.20 340)" opacity="0.7" />
            <circle cx="255" cy="80" r="12" fill="oklch(0.70 0.20 340)" opacity="0.7" />
            <circle cx="170" cy="60" r="8" fill="oklch(0.70 0.20 340)" opacity="0.5" />
            <circle cx="230" cy="60" r="8" fill="oklch(0.70 0.20 340)" opacity="0.5" />
            
            <path 
              d="M 145 30 Q 140 25 145 20 Q 150 18 155 23"
              stroke="url(#mikuHairBg)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M 255 30 Q 260 25 255 20 Q 250 18 245 23"
              stroke="url(#mikuHairBg)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      
      <DancingWaifus />
      
      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 left-20 w-8 h-8 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute top-8 left-40 w-6 h-6 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-4 right-60 w-7 h-7 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-2 left-80 w-5 h-5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-border relative">
                <WifiHigh className="text-primary" size={24} weight="duotone" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight glow-text">Miku Network Scanner</h1>
                <p className="text-xs text-muted-foreground">Powered by Hatsune Miku 💙 ⚡</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-mono text-primary">v3.9.39</p>
                <p className="text-[10px] text-muted-foreground">Cyber Protocol</p>
              </div>
              <MikuCharacter mood="happy" size="small" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-6 h-auto gap-1">
                  <TabsTrigger value="lookup" className="gap-2 py-3">
                    <GlobeHemisphereWest size={18} weight="duotone" />
                    <span className="hidden sm:inline">Domain</span>
                  </TabsTrigger>
                  <TabsTrigger value="ports" className="gap-2 py-3">
                    <Broadcast size={18} weight="duotone" />
                    <span className="hidden sm:inline">Ports</span>
                  </TabsTrigger>
                  <TabsTrigger value="ssl" className="gap-2 py-3">
                    <ShieldCheck size={18} weight="duotone" />
                    <span className="hidden sm:inline">SSL</span>
                  </TabsTrigger>
                  <TabsTrigger value="headers" className="gap-2 py-3">
                    <Article size={18} weight="duotone" />
                    <span className="hidden sm:inline">Headers</span>
                  </TabsTrigger>
                  <TabsTrigger value="whois" className="gap-2 py-3">
                    <IdentificationCard size={18} weight="duotone" />
                    <span className="hidden sm:inline">WHOIS</span>
                  </TabsTrigger>
                  <TabsTrigger value="subdomain" className="gap-2 py-3">
                    <Tree size={18} weight="duotone" />
                    <span className="hidden sm:inline">Subdomain</span>
                  </TabsTrigger>
                  <TabsTrigger value="dns" className="gap-2 py-3">
                    <Database size={18} weight="duotone" />
                    <span className="hidden sm:inline">DNS</span>
                  </TabsTrigger>
                  <TabsTrigger value="robots" className="gap-2 py-3">
                    <Robot size={18} weight="duotone" />
                    <span className="hidden sm:inline">Robots</span>
                  </TabsTrigger>
                  <TabsTrigger value="tech" className="gap-2 py-3">
                    <Code size={18} weight="duotone" />
                    <span className="hidden sm:inline">Tech</span>
                  </TabsTrigger>
                  <TabsTrigger value="network" className="gap-2 py-3">
                    <WifiHigh size={18} weight="duotone" />
                    <span className="hidden sm:inline">Network</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="lookup" className="mt-0">
                  <DomainLookup onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="ports" className="mt-0">
                  <PortScanner onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="ssl" className="mt-0">
                  <SSLChecker onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="headers" className="mt-0">
                  <HeadersAnalyzer onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="whois" className="mt-0">
                  <WhoisLookup onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="subdomain" className="mt-0">
                  <SubdomainFinder onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="dns" className="mt-0">
                  <DNSRecords onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="robots" className="mt-0">
                  <RobotsTxt onScanComplete={addToHistory} />
                </TabsContent>

                <TabsContent value="tech" className="mt-0">
                  <TechStack onScanComplete={addToHistory} />
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
                } else if (scan.type === 'ssl') {
                  setActiveTab('ssl')
                } else if (scan.type === 'headers') {
                  setActiveTab('headers')
                } else if (scan.type === 'whois') {
                  setActiveTab('whois')
                } else if (scan.type === 'subdomain') {
                  setActiveTab('subdomain')
                } else if (scan.type === 'dns') {
                  setActiveTab('dns')
                } else if (scan.type === 'robots') {
                  setActiveTab('robots')
                } else if (scan.type === 'techstack') {
                  setActiveTab('tech')
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
