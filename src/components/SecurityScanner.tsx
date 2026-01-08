import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Stop, 
  GlobeHemisphereWest, 
  ShieldCheck, 
  Article, 
  Broadcast 
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { ScanJob, ScanType, ScanOptions } from '@/lib/types';
import {
  simulateDNSPropagation,
  simulateHTTPTLS,
  simulateSecurityHeaders,
  simulatePortDiscovery
} from '@/lib/scanners';
import ScanResults from '@/components/ScanResults';

interface SecurityScannerProps {
  onScanCreated: (scan: ScanJob) => void;
  onScanUpdated: (id: string, updates: Partial<ScanJob>) => void;
}

export default function SecurityScanner({ onScanCreated, onScanUpdated }: SecurityScannerProps) {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState<ScanType>('dns_propagation');
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS'>('A');
  const [profile, setProfile] = useState<'basic' | 'web'>('web');
  
  const [activeScan, setActiveScan] = useState<ScanJob | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const normalizeTarget = (input: string): string => {
    return input.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase();
  };

  const validateTarget = (target: string): boolean => {
    if (!target || target.length === 0) return false;
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return domainRegex.test(target) || ipRegex.test(target);
  };

  const startScan = async () => {
    const normalizedTarget = normalizeTarget(target);
    
    if (!validateTarget(normalizedTarget)) {
      toast.error('Invalid target format');
      return;
    }

    const options: ScanOptions = {};
    if (scanType === 'dns_propagation') options.recordType = recordType;
    if (scanType === 'port_discovery') options.profile = profile;
    if (scanType === 'http_tls' || scanType === 'headers') options.path = '/';

    const scan: ScanJob = {
      id: crypto.randomUUID(),
      type: scanType,
      target: normalizedTarget,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
      options
    };

    setActiveScan(scan);
    setIsScanning(true);
    onScanCreated(scan);

    setTimeout(() => runScan(scan), 100);
  };

  const runScan = async (scan: ScanJob) => {
    const updateProgress = (progress: number) => {
      setActiveScan(prev => prev ? { ...prev, progress, status: 'running' } : null);
      onScanUpdated(scan.id, { progress, status: 'running', startedAt: scan.startedAt || Date.now() });
    };

    try {
      updateProgress(0);
      
      let result: any;

      if (scan.type === 'dns_propagation') {
        result = await simulateDNSPropagation(
          scan.target,
          scan.options?.recordType || 'A',
          updateProgress
        );
      } else if (scan.type === 'http_tls') {
        result = await simulateHTTPTLS(
          scan.target,
          scan.options?.path || '/',
          updateProgress
        );
      } else if (scan.type === 'headers') {
        result = await simulateSecurityHeaders(
          scan.target,
          scan.options?.path || '/',
          updateProgress
        );
      } else if (scan.type === 'port_discovery') {
        result = await simulatePortDiscovery(
          scan.target,
          scan.options?.profile || 'web',
          updateProgress
        );
      }

      const completedScan: ScanJob = {
        ...scan,
        status: 'success',
        progress: 100,
        finishedAt: Date.now(),
        result
      };

      setActiveScan(completedScan);
      onScanUpdated(scan.id, {
        status: 'success',
        progress: 100,
        finishedAt: Date.now(),
        result
      });
      
      toast.success('Scan completed successfully');
    } catch (error: any) {
      const failedScan: ScanJob = {
        ...scan,
        status: 'failed',
        progress: 100,
        finishedAt: Date.now(),
        error: error?.message || 'Scan failed'
      };

      setActiveScan(failedScan);
      onScanUpdated(scan.id, {
        status: 'failed',
        progress: 100,
        finishedAt: Date.now(),
        error: error?.message || 'Scan failed'
      });
      
      toast.error('Scan failed: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsScanning(false);
    }
  };

  const cancelScan = () => {
    if (activeScan) {
      const canceledScan: ScanJob = {
        ...activeScan,
        status: 'canceled',
        finishedAt: Date.now()
      };
      setActiveScan(canceledScan);
      onScanUpdated(activeScan.id, {
        status: 'canceled',
        finishedAt: Date.now()
      });
    }
    setIsScanning(false);
    toast.info('Scan canceled');
  };

  const resetScan = () => {
    setActiveScan(null);
    setIsScanning(false);
  };

  const getScanTypeIcon = (type: ScanType) => {
    switch (type) {
      case 'dns_propagation': return <GlobeHemisphereWest size={18} weight="duotone" />;
      case 'http_tls': return <ShieldCheck size={18} weight="duotone" />;
      case 'headers': return <Article size={18} weight="duotone" />;
      case 'port_discovery': return <Broadcast size={18} weight="duotone" />;
    }
  };

  const canRun = !isScanning && target.trim().length > 0;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getScanTypeIcon(scanType)}
            Scan Configuration
          </CardTitle>
          <CardDescription>
            Configure and execute security scans on authorized targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Domain or IP</label>
              <Input
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="example.com or 192.168.1.1"
                disabled={isScanning}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Scan Type</label>
              <Select value={scanType} onValueChange={(v) => setScanType(v as ScanType)} disabled={isScanning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dns_propagation">
                    <div className="flex items-center gap-2">
                      <GlobeHemisphereWest size={16} weight="duotone" />
                      DNS Propagation
                    </div>
                  </SelectItem>
                  <SelectItem value="http_tls">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} weight="duotone" />
                      HTTP/TLS Check
                    </div>
                  </SelectItem>
                  <SelectItem value="headers">
                    <div className="flex items-center gap-2">
                      <Article size={16} weight="duotone" />
                      Security Headers
                    </div>
                  </SelectItem>
                  <SelectItem value="port_discovery">
                    <div className="flex items-center gap-2">
                      <Broadcast size={16} weight="duotone" />
                      Port Discovery
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scanType === 'dns_propagation' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Record Type</label>
                <Select value={recordType} onValueChange={(v) => setRecordType(v as any)} disabled={isScanning}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A (IPv4)</SelectItem>
                    <SelectItem value="AAAA">AAAA (IPv6)</SelectItem>
                    <SelectItem value="CNAME">CNAME</SelectItem>
                    <SelectItem value="MX">MX (Mail)</SelectItem>
                    <SelectItem value="TXT">TXT</SelectItem>
                    <SelectItem value="NS">NS (Nameserver)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {scanType === 'port_discovery' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Port Profile</label>
                <Select value={profile} onValueChange={(v) => setProfile(v as any)} disabled={isScanning}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web (80, 443, 8080, 8443, 8000, 8888)</SelectItem>
                    <SelectItem value="basic">Basic (Common ports)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={startScan} 
              disabled={!canRun}
              className="gap-2"
            >
              <Play size={16} weight="fill" />
              Run Scan
            </Button>
            <Button 
              onClick={cancelScan} 
              variant="outline" 
              disabled={!isScanning}
              className="gap-2"
            >
              <Stop size={16} weight="fill" />
              Cancel
            </Button>
            <Button 
              onClick={resetScan} 
              variant="ghost"
            >
              Reset
            </Button>
          </div>

          {activeScan && (
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {activeScan.id.slice(0, 8)}
                  </Badge>
                  <Badge className={`status-${activeScan.status}`}>
                    {activeScan.status}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground font-mono">
                  {activeScan.progress}%
                </span>
              </div>
              <Progress value={activeScan.progress} className="h-2" />
              {activeScan.error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {activeScan.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {activeScan?.result && (
        <ScanResults scan={activeScan} />
      )}
    </div>
  );
}
