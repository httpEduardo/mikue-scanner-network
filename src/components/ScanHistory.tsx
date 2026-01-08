import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Trash, 
  GlobeHemisphereWest, 
  ShieldCheck, 
  Article, 
  Broadcast,
  Clock 
} from '@phosphor-icons/react';
import type { ScanJob, ScanType } from '@/lib/types';

interface ScanHistoryProps {
  scans: ScanJob[];
  onClearHistory: () => void;
}

export default function ScanHistory({ scans, onClearHistory }: ScanHistoryProps) {
  const getScanTypeIcon = (type: ScanType) => {
    switch (type) {
      case 'dns_propagation': return <GlobeHemisphereWest size={16} weight="duotone" />;
      case 'http_tls': return <ShieldCheck size={16} weight="duotone" />;
      case 'headers': return <Article size={16} weight="duotone" />;
      case 'port_discovery': return <Broadcast size={16} weight="duotone" />;
    }
  };

  const getScanTypeName = (type: ScanType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (scan: ScanJob) => {
    if (!scan.startedAt || !scan.finishedAt) return 'N/A';
    const duration = scan.finishedAt - scan.startedAt;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan History</CardTitle>
            <CardDescription>
              View all completed and failed scans
            </CardDescription>
          </div>
          {scans.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearHistory}
              className="gap-2"
            >
              <Trash size={16} />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock size={48} className="text-muted-foreground/30 mb-4" weight="duotone" />
            <h3 className="text-lg font-medium mb-2">No scans yet</h3>
            <p className="text-sm text-muted-foreground">
              Run your first scan to see results here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {scans.map((scan, idx) => (
                <div key={scan.id}>
                  <div className="p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getScanTypeIcon(scan.type)}
                        <div>
                          <h4 className="text-sm font-medium">{getScanTypeName(scan.type)}</h4>
                          <p className="text-xs text-muted-foreground font-mono">{scan.target}</p>
                        </div>
                      </div>
                      <Badge className={`status-${scan.status}`}>
                        {scan.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-mono">{formatDate(scan.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-mono">{getDuration(scan)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-mono">{scan.progress}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Scan ID</p>
                        <p className="font-mono truncate">{scan.id.slice(0, 8)}...</p>
                      </div>
                    </div>

                    {scan.options && Object.keys(scan.options).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Options</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(scan.options).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs font-mono">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {scan.error && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-destructive">{scan.error}</p>
                      </div>
                    )}
                  </div>
                  {idx < scans.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
