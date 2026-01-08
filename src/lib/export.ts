import type { ScanJob, SecurityHeadersResult } from './types';

export interface ComparisonHeader {
  header: string;
  status: 'added' | 'removed' | 'unchanged' | 'changed';
  values: Array<{ scanId: string; value: string | null }>;
}

export interface ExportData {
  target: string;
  scans: ScanJob[];
  comparison: ComparisonHeader[];
  stats: {
    added: number;
    removed: number;
    unchanged: number;
  };
}

const HEADER_DISPLAY_NAMES: Record<string, string> = {
  'strict-transport-security': 'Strict-Transport-Security (HSTS)',
  'content-security-policy': 'Content-Security-Policy (CSP)',
  'x-content-type-options': 'X-Content-Type-Options',
  'x-frame-options': 'X-Frame-Options',
  'referrer-policy': 'Referrer-Policy',
  'permissions-policy': 'Permissions-Policy',
};

export function exportToCSV(data: ExportData): void {
  const lines: string[] = [];
  
  lines.push(`Security Headers Comparison - ${data.target}`);
  lines.push(``);
  lines.push(`Statistics`);
  lines.push(`Added Headers,${data.stats.added}`);
  lines.push(`Removed Headers,${data.stats.removed}`);
  lines.push(`Unchanged Headers,${data.stats.unchanged}`);
  lines.push(``);
  
  const scanHeaders = data.scans.map((scan, idx) => {
    const date = new Date(scan.createdAt).toLocaleString();
    return `Scan ${idx + 1} (${date})`;
  }).join(',');
  
  lines.push(`Header,Status,${scanHeaders}`);
  
  data.comparison.forEach(header => {
    const displayName = HEADER_DISPLAY_NAMES[header.header] || header.header;
    const status = header.status.toUpperCase();
    const values = header.values.map(v => v.value ? `"${v.value.replace(/"/g, '""')}"` : 'Not Set').join(',');
    lines.push(`"${displayName}",${status},${values}`);
  });
  
  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadFile(blob, `security-headers-comparison-${data.target}-${Date.now()}.csv`);
}

export function exportToPDF(data: ExportData): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  let y = 60;
  const leftMargin = 60;
  const rightMargin = width - 60;
  
  ctx.fillStyle = '#0a0a0a';
  ctx.font = 'bold 32px Inter, sans-serif';
  ctx.fillText('Security Headers Comparison', leftMargin, y);
  
  y += 40;
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText(`Target: ${data.target}`, leftMargin, y);
  ctx.fillText(`Generated: ${new Date().toLocaleString()}`, rightMargin - 200, y);
  
  y += 20;
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftMargin, y);
  ctx.lineTo(rightMargin, y);
  ctx.stroke();
  
  y += 40;
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Statistics', leftMargin, y);
  
  y += 40;
  ctx.font = '18px Inter, sans-serif';
  const stats = [
    { label: 'Added Headers', value: data.stats.added },
    { label: 'Removed Headers', value: data.stats.removed },
    { label: 'Unchanged Headers', value: data.stats.unchanged }
  ];
  
  stats.forEach(stat => {
    ctx.fillStyle = '#555555';
    ctx.fillText(`${stat.label}:`, leftMargin, y);
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillStyle = '#0a0a0a';
    ctx.fillText(stat.value.toString(), leftMargin + 250, y);
    ctx.font = '18px Inter, sans-serif';
    y += 30;
  });
  
  y += 20;
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftMargin, y);
  ctx.lineTo(rightMargin, y);
  ctx.stroke();
  
  y += 40;
  ctx.fillStyle = '#0a0a0a';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Header Details', leftMargin, y);
  
  y += 40;
  
  let itemCount = 0;
  const maxItemsPerPage = 15;
  
  data.comparison.forEach(header => {
    if (itemCount >= maxItemsPerPage) return;
    
    const displayName = HEADER_DISPLAY_NAMES[header.header] || header.header;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(displayName, leftMargin, y);
    
    y += 25;
    
    const statusColors: Record<string, string> = {
      unchanged: '#999999',
      removed: '#ef4444',
      added: '#22c55e',
    };
    
    ctx.fillStyle = statusColors[header.status];
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Status: ${header.status.toUpperCase()}`, leftMargin, y);
    
    y += 25;
    
    header.values.forEach((v, idx) => {
      const scanDate = new Date(data.scans[idx].createdAt).toLocaleString();
      ctx.fillStyle = '#666666';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`Scan ${idx + 1} (${scanDate}):`, leftMargin + 20, y);
      y += 20;
      ctx.fillStyle = '#333333';
      const displayValue = v.value ? (v.value.length > 60 ? v.value.substring(0, 57) + '...' : v.value) : 'Not Set';
      ctx.fillText(displayValue, leftMargin + 40, y);
      y += 25;
    });
    
    y += 15;
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftMargin + 20, y);
    ctx.lineTo(rightMargin - 20, y);
    ctx.stroke();
    y += 20;
    
    itemCount++;
  });
  
  y = height - 60;
  ctx.fillStyle = '#999999';
  ctx.font = '12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Generated by Security Toolkit', width / 2, y);
  
  canvas.toBlob(blob => {
    if (blob) {
      downloadFile(blob, `security-headers-comparison-${data.target}-${Date.now()}.png`);
    }
  }, 'image/png');
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
