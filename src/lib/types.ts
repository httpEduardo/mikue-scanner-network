export type ScanType = "dns_propagation" | "http_tls" | "headers" | "port_discovery";

export type ScanStatus = "queued" | "running" | "success" | "failed" | "canceled";

export interface ScanOptions {
  [key: string]: any;
}

export interface ScanJob {
  id: string;
  type: ScanType;
  target: string;
  status: ScanStatus;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
  result?: any;
  progress?: number;
  options?: ScanOptions;
}

export interface DNSPropagationResult {
  expected: any;
  recordType: string;
  resolvers: string[];
  results: Array<{
    resolver: string;
    status: "success" | "mismatch" | "failed";
    value?: any;
    error?: string;
    timeMs: number;
    responseTimeMs?: number;
  }>;
}

export interface HTTPTLSResult {
  url: string;
  statusCode?: number;
  latencyMs?: number;
  redirects?: string[];
  tls?: {
    version: string;
    cipher: string;
    protocol: string;
    issuer: any;
    valid_from: string;
    valid_to: string;
    cert?: {
      subject: any;
      issuer: any;
      valid_from: string;
      valid_to: string;
      fingerprint256: string;
      subjectaltname: string;
    };
  };
  error?: string;
}

export interface SecurityHeadersResult {
  url: string;
  statusCode?: number;
  checks: {
    csp: boolean;
    xfo: boolean;
    hsts: boolean;
    xcto: boolean;
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









