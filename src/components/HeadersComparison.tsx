import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowsLeftRight, 
  CheckCircle, 
  XCircle,
  Plus,
  Minus,
  ArrowRight,
  Warning,
  Info,
  FileCsv,
  FileImage
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { ScanJob, SecurityHeadersResult } from '@/lib/types';
import { exportToCSV, exportToPDF, type ExportData, type ComparisonHeader } from '@/lib/export';

interface HeadersComparisonProps {
  scans: ScanJob[];
}

const HEADER_DISPLAY_NAMES: Record<string, string> = {
  'strict-transport-security': 'Strict-Transport-Security (HSTS)',
  'content-security-policy': 'Content-Security-Policy (CSP)',
  'x-content-type-options': 'X-Content-Type-Options',
  'x-frame-options': 'X-Frame-Options',
  'referrer-policy': 'Referrer-Policy',
  'permissions-policy': 'Permissions-Policy',
};

export default function HeadersComparison({ scans }: HeadersComparisonProps) {
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedScanIds, setSelectedScanIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const headerScans = useMemo(() => {
    return scans.filter(
      scan => scan.type === 'headers' && 
      scan.status === 'success' && 
      scan.result
    );
  }, [scans]);

  const targets = useMemo(() => {
    const uniqueTargets = new Set(headerScans.map(scan => scan.target));
    return Array.from(uniqueTargets).sort();
  }, [headerScans]);

  const scansForTarget = useMemo(() => {
    if (!selectedTarget) return [];
    return headerScans
      .filter(scan => scan.target === selectedTarget)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [headerScans, selectedTarget]);

  const toggleScanSelection = (scanId: string) => {
    setSelectedScanIds(prev => {
      if (prev.includes(scanId)) {
        return prev.filter(id => id !== scanId);
      } else {
        return [...prev, scanId].slice(-5);
      }
    });
  };

  const selectedScans = useMemo(() => {
    return scansForTarget
      .filter(scan => selectedScanIds.includes(scan.id))
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [scansForTarget, selectedScanIds]);

  const comparisonData = useMemo(() => {
    if (selectedScans.length < 2) return null;

    const allHeaders = new Set<string>();
    selectedScans.forEach(scan => {
      const result = scan.result as SecurityHeadersResult;
      Object.keys(result.headers).forEach(header => {
        if (HEADER_DISPLAY_NAMES[header]) {
          allHeaders.add(header);
        }
      });
      result.missing.forEach(header => allHeaders.add(header));
    });

    const comparison: ComparisonHeader[] = [];

    allHeaders.forEach(headerName => {
      const values = selectedScans.map(scan => {
        const result = scan.result as SecurityHeadersResult;
        return result.headers[headerName] || undefined;
      });

      let status: ComparisonHeader['status'] = 'unchanged';
      
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      
      if (firstValue === undefined && lastValue !== undefined) {
        status = 'added';
      } else if (firstValue !== undefined && lastValue === undefined) {
        status = 'removed';
      } else if (firstValue !== lastValue) {
        status = 'changed';
      }

      comparison.push({
        header: headerName,
        status,
        values: selectedScans.map((scan, idx) => ({
          scanId: scan.id,
          value: values[idx] || null
        }))
      });
    });

    comparison.sort((a, b) => {
      const statusOrder = { added: 0, changed: 1, removed: 2, unchanged: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return comparison;
  }, [selectedScans]);

  const stats = useMemo(() => {
    if (!comparisonData) return null;

    const added = comparisonData.filter(h => h.status === 'added').length;
    const removed = comparisonData.filter(h => h.status === 'removed').length;
    const changed = comparisonData.filter(h => h.status === 'changed').length;
    const unchanged = comparisonData.filter(h => h.status === 'unchanged').length;

    return { added, removed, changed, unchanged };
  }, [comparisonData]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: ComparisonHeader['status']) => {
    switch (status) {
      case 'added':
        return <Plus className="text-success" size={18} weight="bold" />;
      case 'removed':
        return <Minus className="text-destructive" size={18} weight="bold" />;
      case 'changed':
        return <ArrowRight className="text-warning" size={18} weight="bold" />;
      case 'unchanged':
        return <CheckCircle className="text-muted-foreground" size={18} weight="duotone" />;
    }
  };

  const getStatusBadge = (status: ComparisonHeader['status']) => {
    switch (status) {
      case 'added':
        return <Badge className="bg-success/10 text-success border-success/30">Added</Badge>;
      case 'removed':
        return <Badge variant="destructive">Removed</Badge>;
      case 'changed':
        return <Badge className="bg-warning/10 text-warning border-warning/30">Changed</Badge>;
      case 'unchanged':
        return <Badge variant="secondary">Unchanged</Badge>;
    }
  };

  const handleCompare = () => {
    if (selectedScanIds.length >= 2) {
      setShowComparison(true);
    }
  };

  const handleReset = () => {
    setShowComparison(false);
    setSelectedScanIds([]);
    setSelectedTarget('');
  };

  const handleExportCSV = () => {
    if (!comparisonData || !stats) return;
    
    const exportData: ExportData = {
      target: selectedTarget,
      scans: selectedScans,
      comparison: comparisonData,
      stats
    };
    
    try {
      exportToCSV(exportData);
      toast.success('CSV report exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV report');
      console.error(error);
    }
  };

  const handleExportPDF = () => {
    if (!comparisonData || !stats) return;
    
    const exportData: ExportData = {
      target: selectedTarget,
      scans: selectedScans,
      comparison: comparisonData,
      stats
    };
    
    try {
      exportToPDF(exportData);
      toast.success('PDF report exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF report');
      console.error(error);
    }
  };

  if (headerScans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowsLeftRight className="text-primary" size={24} weight="duotone" />
            Security Headers Comparison
          </CardTitle>
          <CardDescription>
            Track changes in security headers over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <XCircle size={48} className="text-muted-foreground/30 mb-4" weight="duotone" />
            <h3 className="text-lg font-medium mb-2">No header scans found</h3>
            <p className="text-sm text-muted-foreground">
              Run security header scans first to compare them
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowsLeftRight className="text-primary" size={24} weight="duotone" />
            Security Headers Comparison
          </CardTitle>
          <CardDescription>
            Compare security headers across multiple scans to track changes over time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Target</label>
            <Select 
              value={selectedTarget} 
              onValueChange={(value) => {
                setSelectedTarget(value);
                setSelectedScanIds([]);
                setShowComparison(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a target domain" />
              </SelectTrigger>
              <SelectContent>
                {targets.map(target => {
                  const count = headerScans.filter(s => s.target === target).length;
                  return (
                    <SelectItem key={target} value={target}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono">{target}</span>
                        <Badge variant="outline" className="ml-2">{count} scans</Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedTarget && scansForTarget.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Select Scans to Compare (2-5)
                </label>
                <span className="text-xs text-muted-foreground">
                  {selectedScanIds.length} selected
                </span>
              </div>
              
              <ScrollArea className="h-[300px] rounded-md border border-border p-4">
                <div className="space-y-2">
                  {scansForTarget.map((scan) => (
                    <div
                      key={scan.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedScanIds.includes(scan.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleScanSelection(scan.id)}
                    >
                      <Checkbox
                        id={scan.id}
                        checked={selectedScanIds.includes(scan.id)}
                        onCheckedChange={() => toggleScanSelection(scan.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-mono font-medium truncate">
                            {scan.id.slice(0, 8)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {formatDate(scan.createdAt)}
                          </Badge>
                        </div>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>
                            {Object.keys((scan.result as SecurityHeadersResult).headers).length} headers
                          </span>
                          <span>•</span>
                          <span>
                            {(scan.result as SecurityHeadersResult).missing.length} missing
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {selectedScanIds.length > 0 && selectedScanIds.length < 2 && (
                <Alert>
                  <Info size={18} />
                  <AlertDescription>
                    Select at least 2 scans to compare changes
                  </AlertDescription>
                </Alert>
              )}

              {selectedScanIds.length >= 2 && (
                <div className="flex gap-2">
                  <Button onClick={handleCompare} className="gap-2">
                    <ArrowsLeftRight size={18} weight="duotone" />
                    Compare Selected Scans
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {showComparison && comparisonData && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="glow-border bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Comparison Results</CardTitle>
                    <CardDescription className="mt-1 font-mono">
                      {selectedTarget} • {selectedScans.length} scans
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {stats.added > 0 && (
                        <Badge className="bg-success/10 text-success border-success/30">
                          +{stats.added} Added
                        </Badge>
                      )}
                      {stats.changed > 0 && (
                        <Badge className="bg-warning/10 text-warning border-warning/30">
                          {stats.changed} Changed
                        </Badge>
                      )}
                      {stats.removed > 0 && (
                        <Badge variant="destructive">
                          -{stats.removed} Removed
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2 pl-2 border-l border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCSV}
                        className="gap-2"
                      >
                        <FileCsv size={16} weight="duotone" />
                        CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportPDF}
                        className="gap-2"
                      >
                        <FileImage size={16} weight="duotone" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <div className="sticky top-0 bg-card z-10 pb-4 border-b border-border">
                      <div className="grid gap-2" style={{ gridTemplateColumns: `250px repeat(${selectedScans.length}, 1fr)` }}>
                        <div className="text-sm font-medium text-muted-foreground">
                          Security Header
                        </div>
                        {selectedScans.map((scan, idx) => (
                          <div key={scan.id} className="text-xs">
                            <div className="font-medium font-mono mb-1">
                              Scan {idx + 1}
                            </div>
                            <div className="text-muted-foreground">
                              {formatDate(scan.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {comparisonData.map((header, index) => (
                      <motion.div
                        key={header.header}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`p-4 rounded-lg border ${
                          header.status === 'added'
                            ? 'border-success/50 bg-success/5'
                            : header.status === 'removed'
                            ? 'border-destructive/50 bg-destructive/5'
                            : header.status === 'changed'
                            ? 'border-warning/50 bg-warning/5'
                            : 'border-border/50 bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {getStatusIcon(header.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-mono font-semibold text-sm">
                                {HEADER_DISPLAY_NAMES[header.header] || header.header}
                              </p>
                              {getStatusBadge(header.status)}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selectedScans.length}, 1fr)` }}>
                          {header.values.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2 rounded bg-background/50 border border-border/30"
                            >
                              {item.value ? (
                                <>
                                  <div className="flex items-center gap-1 mb-1">
                                    <CheckCircle className="text-success" size={14} weight="fill" />
                                    <span className="font-medium text-success">Present</span>
                                  </div>
                                  <p className="font-mono text-muted-foreground break-all line-clamp-2">
                                    {item.value}
                                  </p>
                                </>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <XCircle className="text-muted-foreground" size={14} weight="fill" />
                                  <span className="font-medium text-muted-foreground">Missing</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {header.status === 'added' && (
                          <Alert className="mt-3 bg-success/5 border-success/30">
                            <Info size={16} className="text-success" />
                            <AlertDescription className="text-xs text-success">
                              This header was added - security posture improved
                            </AlertDescription>
                          </Alert>
                        )}

                        {header.status === 'removed' && (
                          <Alert className="mt-3" variant="destructive">
                            <Warning size={16} />
                            <AlertDescription className="text-xs">
                              This header was removed - security posture degraded
                            </AlertDescription>
                          </Alert>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
