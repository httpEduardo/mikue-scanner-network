export type ScanType = "dns_propagation" | "http_tls" | "headers" | "port_discovery";

export type ScanStatus = "queued" | "running" | "success" | "failed" | "canceled";

  type: ScanType;
  status: Sca
  createdAt: numb
  finishedAt?: nu
  result?: any;
}
export interface Sca
  profile?: "basic" |
}
export interface 
  expected: any
  results: Array<{
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
      issuer: any;
      valid_to: str
     
 

  url: string;
  checks: {
    csp: boolean;
    xfo: boolean;
    permissions: bo
  missin
}
export inte
  ports: Array<{
    state: "open" 
  }>;
















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




