import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Warning, Clock } from '@phosphor-icons/react';
import type { ScanJob, DNSPropagationResult, HTTPTLSResult, SecurityHeadersResult, PortDiscoveryResult } from '@/lib/types';

interface ScanResultsProps {
  scan: ScanJob;
}

export default function ScanResults({ scan }: ScanResultsProps) {
  if (!scan.result) return null;

  const renderDNSPropagation = (result: DNSPropagationResult) => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Expected Value</h4>
        <div className="bg-muted p-3 rounded-md font-mono text-xs">
          {JSON.stringify(result.expected, null, 2)}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Resolver Results</h4>
        <div className="space-y-2">
          {result.results.map((r, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-3">
                {r.status === 'success' && <CheckCircle className="text-success" size={20} weight="fill" />}
                {r.status === 'mismatch' && <Warning className="text-warning" size={20} weight="fill" />}
                {r.status === 'failed' && <XCircle className="text-destructive" size={20} weight="fill" />}
                <div>
                  <p className="font-mono text-sm font-medium">{r.resolver}</p>
                  {r.error && <p className="text-xs text-destructive">{r.error}</p>}
                  {r.value && (
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {JSON.stringify(r.value)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`status-${r.status}`}>
                  {r.status}
                </Badge>
                {r.responseTimeMs && (
                  <Badge variant="outline" className="font-mono">
                    {r.responseTimeMs}ms
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHTTPTLS = (result: HTTPTLSResult) => {
    const validFrom = new Date(result.tls.cert.valid_from);
    const validTo = new Date(result.tls.cert.valid_to);
    const now = new Date();
    const isValid = now >= validFrom && now <= validTo;
    const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">URL</p>
            <p className="font-mono text-sm">{result.url}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status Code</p>
            <Badge variant="outline">{result.statusCode}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Latency</p>
            <p className="font-mono text-sm">{result.latencyMs}ms</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Protocol</p>
            <Badge className="status-success">{result.tls.protocol}</Badge>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="text-success" size={18} weight="fill" />
            ) : (
              <XCircle className="text-destructive" size={18} weight="fill" />
            )}
            Certificate Details
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="font-mono text-sm">{result.tls.cert.subject?.CN || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Issuer</p>
                <p className="font-mono text-sm">{result.tls.cert.issuer?.CN || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valid From</p>
                <p className="font-mono text-sm">{validFrom.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valid To</p>
                <p className="font-mono text-sm">{validTo.toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge className={isValid ? 'status-success' : 'status-failed'}>
                {isValid ? `Valid (${daysUntilExpiry} days remaining)` : 'Invalid or Expired'}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Subject Alt Names</p>
              <p className="font-mono text-xs text-muted-foreground">{result.tls.cert.subjectaltname}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Fingerprint (SHA-256)</p>
              <p className="font-mono text-xs text-muted-foreground break-all">{result.tls.cert.fingerprint256}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSecurityHeaders = (result: SecurityHeadersResult) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">URL</p>
          <p className="font-mono text-sm">{result.url}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Status Code</p>
          <Badge variant="outline">{result.statusCode}</Badge>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Security Headers Check</h4>
        <div className="space-y-2">
          <HeaderCheck label="Strict-Transport-Security (HSTS)" present={result.checks.hsts} />
          <HeaderCheck label="Content-Security-Policy (CSP)" present={result.checks.csp} />
          <HeaderCheck label="X-Content-Type-Options" present={result.checks.xcto} />
          <HeaderCheck label="X-Frame-Options / frame-ancestors" present={result.checks.xfo} />
          <HeaderCheck label="Referrer-Policy" present={result.checks.referrer} />
          <HeaderCheck label="Permissions-Policy" present={result.checks.permissions} />
        </div>
      </div>

      {result.missing.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Warning className="text-warning" size={18} weight="fill" />
              Missing Headers ({result.missing.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.missing.map((header, idx) => (
                <Badge key={idx} variant="outline" className="font-mono text-xs">
                  {header}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-2">All Response Headers</h4>
        <ScrollArea className="h-[200px] w-full">
          <div className="bg-muted p-3 rounded-md font-mono text-xs space-y-1">
            {Object.entries(result.headers).map(([key, value]) => (
              <div key={key}>
                <span className="text-primary">{key}</span>: {value}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderPortDiscovery = (result: PortDiscoveryResult) => (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground">Target IP</p>
        <p className="font-mono text-sm">{result.ip}</p>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Port Scan Results</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {result.ports.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                {p.state === 'open' && <CheckCircle className="text-success" size={16} weight="fill" />}
                {p.state === 'closed' && <XCircle className="text-muted-foreground" size={16} weight="fill" />}
                {p.state === 'filtered' && <Warning className="text-warning" size={16} weight="fill" />}
                <span className="font-mono text-sm font-medium">{p.port}</span>
              </div>
              <Badge variant="outline" className={`text-xs status-${p.state === 'open' ? 'success' : p.state === 'filtered' ? 'queued' : 'canceled'}`}>
                {p.state}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-2">Statistics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Open Ports</p>
            <p className="text-2xl font-bold text-success">
              {result.ports.filter(p => p.state === 'open').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Closed Ports</p>
            <p className="text-2xl font-bold text-muted-foreground">
              {result.ports.filter(p => p.state === 'closed').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Filtered Ports</p>
            <p className="text-2xl font-bold text-warning">
              {result.ports.filter(p => p.state === 'filtered').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Results</CardTitle>
        <CardDescription>
          {scan.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} scan of {scan.target}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scan.type === 'dns_propagation' && renderDNSPropagation(scan.result)}
        {scan.type === 'http_tls' && renderHTTPTLS(scan.result)}
        {scan.type === 'headers' && renderSecurityHeaders(scan.result)}
        {scan.type === 'port_discovery' && renderPortDiscovery(scan.result)}
      </CardContent>
    </Card>
  );
}

function HeaderCheck({ label, present }: { label: string; present: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {present ? (
          <>
            <CheckCircle className="text-success" size={16} weight="fill" />
            <Badge className="status-success text-xs">Present</Badge>
          </>
        ) : (
          <>
            <XCircle className="text-destructive" size={16} weight="fill" />
            <Badge className="status-failed text-xs">Missing</Badge>
          </>
        )}
      </div>
    </div>
  );
}
