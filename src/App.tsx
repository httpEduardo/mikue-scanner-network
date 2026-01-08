import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Activity, ArrowsLeftRight } from '@phosphor-icons/react';
import SecurityScanner from '@/components/SecurityScanner';
import ScanHistory from '@/components/ScanHistory';
import HeadersComparison from '@/components/HeadersComparison';
import type { ScanJob } from '@/lib/types';

function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [scans, setScans] = useKV<ScanJob[]>('security-scans', []);

  const addScan = (scan: ScanJob) => {
    setScans((current) => [scan, ...current].slice(0, 50));
  };

  const updateScan = (id: string, updates: Partial<ScanJob>) => {
    setScans((current) => 
      current.map((scan) => scan.id === id ? { ...scan, ...updates } : scan)
    );
  };

  const clearHistory = () => {
    setScans([]);
  };

  return (
    <div className="min-h-screen bg-background cyber-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary/5 animate-float blur-2xl" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-40 left-20 w-40 h-40 rounded-full bg-accent/5 animate-float blur-2xl" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center glow-border relative">
                  <ShieldCheck className="text-primary" size={28} weight="duotone" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-pulse-ring opacity-75" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight glow-text">Security Toolkit</h1>
                  <p className="text-xs text-muted-foreground">Controlled Network Reconnaissance & Analysis</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-mono text-primary">v2.1.0</p>
                  <p className="text-[10px] text-muted-foreground">Secure Protocol</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Activity className="text-success" size={20} weight="duotone" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="scanner" className="gap-2">
                <ShieldCheck size={18} weight="duotone" />
                Scanner
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <Activity size={18} weight="duotone" />
                History ({scans.length})
              </TabsTrigger>
              <TabsTrigger value="comparison" className="gap-2">
                <ArrowsLeftRight size={18} weight="duotone" />
                Compare
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="mt-0">
              <SecurityScanner 
                onScanCreated={addScan}
                onScanUpdated={updateScan}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <ScanHistory scans={scans} onClearHistory={clearHistory} />
            </TabsContent>

            <TabsContent value="comparison" className="mt-0">
              <HeadersComparison scans={scans} />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-border/30 mt-16">
          <div className="container mx-auto px-6 py-4">
            <p className="text-center text-xs text-muted-foreground">
              Security Toolkit • Non-invasive reconnaissance for authorized targets only
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
