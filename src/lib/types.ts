export type ScanType = "dns_propagation" | "http_tls" | "headers" | "port_discovery";

export type ScanStatus = "queued" | "running" | "success" | "failed" | "canceled";

}
export interface Scan
 

export interface ScanJob {
  id: string;
  type: ScanType;
  target: string;
  status: ScanStatus;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
export interface 
  recordType: s
  results: Array<{
    status: "success" | 
 

}
export interface H
  statusCode?: numb
  redirects?: string[
    version: string;
    protocol: strin
    valid_from: str
    c
 

      subjectaltname: string;
  };
}
export interface Securi
  statusC
    csp: boolean;
    hsts: boolean;
    referrer: bo
  };
  headers: Record<str

  ip: string;
 

}





















