import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Broadcast, CheckCircle, Warning, XCircle, Clock } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import MikuCharacter from './MikuCharacter';
import { useSoundEffects } from '@/hooks/use-sound-effects';

interface DNSPropagationCheckerProps {
  onScanComplete: (scan: any) => void;
}

interface DNSServer {
  name: string;
  provider: string;
  location: string;
  ip: string;
}

const DNS_SERVERS: DNSServer[] = [
  { name: 'Cloudflare', provider: 'Cloudflare', location: 'Global', ip: '1.1.1.1' },
  { name: 'Google', provider: 'Google', location: 'Global', ip: '8.8.8.8' },
  { name: 'Quad9', provider: 'Quad9', location: 'Global', ip: '9.9.9.9' },
  { name: 'OpenDNS', provider: 'Cisco', location: 'Global', ip: '208.67.222.222' },
];

interface PropagationResult {
  server: DNSServer;
  status: 'resolved' | 'failed' | 'mismatch';
  value?: string;
  error?: string;
  responseTime?: number;
}

export default function DNSPropagationChecker({ onScanComplete }: DNSPropagationCheckerProps) {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<PropagationResult[]>([]);
  const [progress, setProgress] = useState(0);
  const { playClickSound, playScanStartSound, playScanCompleteSound, playErrorSound, playSuccessSound } = useSoundEffects();

  const checkDNSServer = async (server: DNSServer, cleanDomain: string, type: string): Promise<PropagationResult> => {
    try {
      const startTime = performance.now();

      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=${type}`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      const data = await response.json();
      
      if (data.Answer && data.Answer.length > 0) {
        return {
          server,
          status: 'resolved',
          value: data.Answer[0].data,
          responseTime
        };
      } else {
        return {
          server,
          status: 'failed',
          error: 'No records found',
          responseTime
        };
      }
    } catch (error) {
      return {
        server,
        status: 'failed',
        error: 'Connection timeout'
      };
    }
  };

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name');
      playErrorSound();
      return;
    }

    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/;
    
    if (!domainRegex.test(cleanDomain)) {
      toast.error('Please enter a valid domain name (e.g., example.com)');
      playErrorSound();
      return;
    }

    playClickSound();
    playScanStartSound();
    setIsChecking(true);
    setResults([]);
    setProgress(0);

    const allResults: PropagationResult[] = [];

    for (let i = 0; i < DNS_SERVERS.length; i++) {
      const result = await checkDNSServer(DNS_SERVERS[i], cleanDomain, recordType);
      allResults.push(result);
      setResults([...allResults]);
      setProgress(((i + 1) / DNS_SERVERS.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    const resolvedValues = allResults
      .filter(r => r.status === 'resolved' && r.value)
      .map(r => r.value);
    const uniqueValues = new Set(resolvedValues);
    
    if (uniqueValues.size > 1) {
      allResults.forEach(result => {
        if (result.status === 'resolved') {
          const mostCommon = [...uniqueValues][0];
          if (result.value !== mostCommon) {
            result.status = 'mismatch';
          }
        }
      });
      setResults([...allResults]);
    }

    setIsChecking(false);
    setProgress(0);
    playScanCompleteSound();
    
    if (uniqueValues.size > 1) {
      toast.warning('DNS propagation incomplete - different values detected');
    } else if (resolvedValues.length > 0) {
      playSuccessSound();
      toast.success('DNS fully propagated across all servers!');
    } else {
      playErrorSound();
      toast.error('DNS records not found on any server');
    }

    onScanComplete({
      type: 'dns-propagation',
      domain: cleanDomain,
      recordType,
      results: allResults,
      propagated: uniqueValues.size <= 1 && resolvedValues.length > 0
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      resolved: 'bg-primary/20 text-primary border-primary/30',
      failed: 'bg-destructive/20 text-destructive border-destructive/30',
      mismatch: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    };
    return colors[status] || colors.failed;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} weight="duotone" />;
      case 'mismatch':
        return <Clock size={16} weight="duotone" />;
      default:
        return <XCircle size={16} weight="duotone" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Broadcast className="text-primary" size={24} weight="duotone" />
            DNS Propagation Checker
          </CardTitle>
          <CardDescription>
            Check if your DNS records have propagated across global DNS servers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="dns-propagation-domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isChecking && handleCheck()}
              disabled={isChecking}
              className="flex-1"
            />
            <Select value={recordType} onValueChange={setRecordType} disabled={isChecking}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="AAAA">AAAA</SelectItem>
                <SelectItem value="CNAME">CNAME</SelectItem>
                <SelectItem value="MX">MX</SelectItem>
                <SelectItem value="TXT">TXT</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleCheck}
              disabled={isChecking}
              className="gap-2"
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Checking
                </>
              ) : (
                <>
                  <Broadcast size={18} weight="duotone" />
                  Check
                </>
              )}
            </Button>
          </div>

          {isChecking && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Checking DNS servers...</span>
                <span className="text-primary font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {results.length === 0 && !isChecking && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <MikuCharacter mood="happy" size="medium" />
          </motion.div>
        )}

        {isChecking && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <MikuCharacter mood="scanning" size="medium" />
          </motion.div>
        )}

        {results.length > 0 && !isChecking && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="text-primary" size={24} weight="duotone" />
                  Propagation Results
                  <Badge variant="secondary" className="ml-auto">
                    {results.filter(r => r.status === 'resolved').length} / {results.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  DNS {recordType} records for {domain}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-4 rounded-lg border border-border/50 bg-muted/30"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`gap-1.5 ${getStatusColor(result.status)} border`}>
                                {getStatusIcon(result.status)}
                                {result.status}
                              </Badge>
                              <p className="font-medium">{result.server.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {result.server.provider} • {result.server.location} • {result.server.ip}
                              </p>
                            </div>
                          </div>
                          {result.responseTime && (
                            <Badge variant="outline" className="font-mono text-xs">
                              {result.responseTime}ms
                            </Badge>
                          )}
                        </div>
                        {result.value && (
                          <div className="mt-2 p-2 rounded bg-primary/10 border border-primary/30">
                            <p className="text-xs text-muted-foreground mb-1">Resolved Value:</p>
                            <p className="font-mono text-sm break-all">{result.value}</p>
                          </div>
                        )}
                        {result.error && (
                          <Alert variant="destructive" className="mt-2">
                            <Warning size={16} />
                            <AlertDescription className="text-xs">{result.error}</AlertDescription>
                          </Alert>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <MikuCharacter mood="success" size="medium" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
