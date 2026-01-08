import type { DNSPropagationResult, HTTPTLSResult, SecurityHeadersResult, PortDiscoveryResult, ScanOptions } from './types';

const DNS_RESOLVERS = ["1.1.1.1", "8.8.8.8", "9.9.9.9", "208.67.222.222"];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function simulateDNSPropagation(
  domain: string,
  recordType: string,
  onProgress: (pct: number) => void
): Promise<DNSPropagationResult> {
  const results: DNSPropagationResult["results"] = [];
  let expected: any = null;

  for (let i = 0; i < DNS_RESOLVERS.length; i++) {
    const resolver = DNS_RESOLVERS[i];
    onProgress(Math.round((i / DNS_RESOLVERS.length) * 100));
    
    await delay(300 + Math.random() * 500);

    try {
      const mockValue = recordType === "A" 
        ? [`${192 + Math.floor(Math.random() * 10)}.168.1.${Math.floor(Math.random() * 255)}`]
        : recordType === "AAAA"
        ? [`2001:0db8::${Math.floor(Math.random() * 10)}`]
        : recordType === "MX"
        ? [`10 mail.${domain}`]
        : recordType === "TXT"
        ? [`v=spf1 include:_spf.${domain} ~all`]
        : recordType === "NS"
        ? [`ns1.${domain}`, `ns2.${domain}`]
        : [`${domain}`];

      if (expected === null) {
        expected = mockValue;
      }

      const mismatch = i === 2 && Math.random() > 0.7;
      const value = mismatch ? [...mockValue, "extra.record"] : mockValue;

      results.push({
        resolver,
        status: mismatch ? "mismatch" : "success",
        value,
        responseTimeMs: Math.round(50 + Math.random() * 200)
      });
    } catch (e: any) {
      results.push({
        resolver,
        status: "failed",
        error: e?.message ?? "resolve_failed"
      });
    }
  }

  onProgress(100);
  return { expected, recordType, resolvers: DNS_RESOLVERS, results };
}

export async function simulateHTTPTLS(
  target: string,
  path: string,
  onProgress: (pct: number) => void
): Promise<HTTPTLSResult> {
  onProgress(20);
  await delay(500);
  
  onProgress(60);
  await delay(400);

  const protocols = ["TLSv1.2", "TLSv1.3"];
  const now = new Date();
  const validFrom = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const validTo = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  onProgress(100);

  return {
    url: `https://${target}${path}`,
    statusCode: 200,
    latencyMs: Math.round(100 + Math.random() * 300),
    finalUrl: `https://${target}${path}`,
    tls: {
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      cert: {
        subject: { CN: target, O: "Example Organization", C: "US" },
        issuer: { CN: "Let's Encrypt Authority X3", O: "Let's Encrypt", C: "US" },
        valid_from: validFrom.toISOString(),
        valid_to: validTo.toISOString(),
        fingerprint256: "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99",
        subjectaltname: `DNS:${target}, DNS:www.${target}`
      }
    }
  };
}

export async function simulateSecurityHeaders(
  target: string,
  path: string,
  onProgress: (pct: number) => void
): Promise<SecurityHeadersResult> {
  onProgress(30);
  await delay(400);
  
  onProgress(70);
  await delay(300);

  const hasHSTS = Math.random() > 0.3;
  const hasCSP = Math.random() > 0.5;
  const hasXCTO = Math.random() > 0.4;
  const hasXFO = Math.random() > 0.4;
  const hasReferrer = Math.random() > 0.6;
  const hasPermissions = Math.random() > 0.7;

  const headers: Record<string, string> = {
    "content-type": "text/html; charset=utf-8",
    "content-length": "1234",
    "date": new Date().toUTCString(),
    "server": "nginx/1.21.0",
  };

  if (hasHSTS) headers["strict-transport-security"] = "max-age=31536000; includeSubDomains";
  if (hasCSP) headers["content-security-policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'";
  if (hasXCTO) headers["x-content-type-options"] = "nosniff";
  if (hasXFO) headers["x-frame-options"] = "SAMEORIGIN";
  if (hasReferrer) headers["referrer-policy"] = "strict-origin-when-cross-origin";
  if (hasPermissions) headers["permissions-policy"] = "geolocation=(), microphone=()";

  const checks = {
    hsts: hasHSTS,
    csp: hasCSP,
    xcto: hasXCTO,
    xfo: hasXFO,
    referrer: hasReferrer,
    permissions: hasPermissions
  };

  const missing: string[] = [];
  if (!hasHSTS) missing.push("strict-transport-security");
  if (!hasCSP) missing.push("content-security-policy");
  if (!hasXCTO) missing.push("x-content-type-options");
  if (!hasXFO) missing.push("x-frame-options");
  if (!hasReferrer) missing.push("referrer-policy");
  if (!hasPermissions) missing.push("permissions-policy");

  onProgress(100);

  return {
    url: `https://${target}${path}`,
    statusCode: 200,
    checks,
    missing,
    headers
  };
}

export async function simulatePortDiscovery(
  target: string,
  profile: "basic" | "web",
  onProgress: (pct: number) => void
): Promise<PortDiscoveryResult> {
  const portProfiles = {
    basic: [21, 22, 25, 53, 80, 110, 143, 443, 3306, 3389, 5432, 8080],
    web: [80, 443, 8000, 8080, 8443, 8888]
  };

  const ports = portProfiles[profile];
  const results: PortDiscoveryResult["ports"] = [];

  for (let i = 0; i < ports.length; i++) {
    const port = ports[i];
    onProgress(Math.round((i / ports.length) * 100));
    
    await delay(200 + Math.random() * 300);

    const rand = Math.random();
    const state: "open" | "closed" | "filtered" = 
      (port === 80 || port === 443) ? "open" :
      rand > 0.7 ? "open" :
      rand > 0.4 ? "closed" :
      "filtered";

    results.push({
      port,
      state,
      timeMs: Math.round(10 + Math.random() * 100)
    });
  }

  onProgress(100);

  return {
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    ports: results.sort((a, b) => a.port - b.port)
  };
}
