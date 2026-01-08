export type ScanType = "dns_propagation" | "http_tls" | "headers" | "port_discovery";

export type ScanStatus = "queued" | "running" | "success" | "failed" | "canceled";

  status: ScanStatus;
  startedAt?:
  error?: string;
  progress?: numb
  status: ScanStatus;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
  result?: any;
  progress?: number;
  options?: ScanOptions;
 

}
export interface HTTPTLSResult {
  statusCode?: number;
  latencyMs?: nu
 

    valid_from: string;
    cert?: {
      issuer: an
      valid_to: string
      fingerprint2
  };
}
export interface
    error?: string;
    timeMs: number;
  }>;
}

export interface HTTPTLSResult {
  url: string;
  statusCode?: number;
  redirects?: string[];
  tls?: {
    version: string;
    cipher: string;
    issuer: any;
    valid_from: string;
    valid_to: string;
  };
  error?: string;
}

export interface SecurityHeadersResult {
  url: string;
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









