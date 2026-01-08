export type ScanType = "dns_propagation" | "http_tls" | "headers" | "port_discovery";

export type ScanStatus = "queued" | "running" | "success" | "failed" | "canceled";

export interface ScanJob {
  id: string;
  type: ScanType;
  target: string;
  status: ScanStatus;
  progress: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
  result?: any;
  options?: ScanOptions;
}

export interface ScanOptions {
  recordType?: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS";
  profile?: "basic" | "web";
  path?: string;
}

export interface DNSPropagationResult {
  recordType: string;
  expected: any;
  resolvers: string[];
  results: Array<{
    resolver: string;
    status: "success" | "mismatch" | "failed";
    value?: any;
    responseTimeMs?: number;
    error?: string;
  }>;
}

export interface HTTPTLSResult {
  url: string;
  statusCode: number;
  latencyMs: number;
  finalUrl: string;
  tls: {
    protocol: string;
    cert: {
      subject: any;
      issuer: any;
      valid_from: string;
      valid_to: string;
      fingerprint256: string;
      subjectaltname: string;
    };
  };
}

export interface SecurityHeadersResult {
  url: string;
  statusCode: number;
  checks: {
    hsts: boolean;
    csp: boolean;
    xcto: boolean;
    xfo: boolean;
    referrer: boolean;
    permissions: boolean;
  };
  missing: string[];
  headers: Record<string, string>;
}

export interface PortDiscoveryResult {
  ip: string;
  ports: Array<{
    port: number;
    state: "open" | "closed" | "filtered";
    timeMs: number;
  }>;
}





