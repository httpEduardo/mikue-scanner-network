# Planning Guide

A playful Hatsune Miku-themed network utility dashboard where Miku assists users with network diagnostics and information gathering tasks.

**Experience Qualities**:
1. **Kawaii** - Embraces vibrant teal/cyan aesthetics with playful anime-inspired UI elements that feel energetic and fun
2. **Helpful** - Provides useful network utilities in an approachable, non-intimidating way with clear results and explanations
3. **Interactive** - Features responsive animations and delightful micro-interactions that make technical tasks feel engaging

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is a comprehensive penetration testing toolkit with ten distinct network security tools that maintain state, provide real-time feedback, and require sophisticated data handling across multiple scanning methodologies.

## Essential Features

### Domain/IP Lookup
- **Functionality**: Resolves domain names to IP addresses and provides geographic information using Google DNS API
- **Purpose**: Allows users to discover the IP address and location data for any website
- **Trigger**: User enters a domain name (e.g., example.com) and clicks "Lookup"
- **Progression**: Input domain → Validate input → Resolve DNS via Google DNS API → Fetch geo data → Display IP, location, ISP info → Save to history
- **Success criteria**: Displays accurate IP address and related information, handles invalid domains gracefully

### Port Scanner
- **Functionality**: Checks common ports (21, 22, 23, 25, 80, 110, 143, 443, 3306, 5432, 6379, 8080, 27017) for a given IP/domain
- **Purpose**: Helps users identify which services are potentially accessible on a target
- **Trigger**: User enters IP/domain and clicks "Scan"
- **Progression**: Input target → Simulate port checks on common ports → Display open/closed status with service names → Animate results appearing → Save to history
- **Success criteria**: Shows clear visual indication of port status with recognizable service labels

### SSL/TLS Certificate Checker
- **Functionality**: Verifies SSL certificate validity, expiration dates, and security grade
- **Purpose**: Helps users assess the security of a website's SSL/TLS configuration
- **Trigger**: User enters a domain and clicks "Check"
- **Progression**: Input domain → Attempt HTTPS connection → Display certificate details, expiration, issuer, protocol → Show security grade → Save to history
- **Success criteria**: Shows certificate validity, days remaining, and security rating with clear visual indicators

### HTTP Headers Analyzer
- **Functionality**: Analyzes security-related HTTP headers and provides recommendations
- **Purpose**: Helps users understand security posture through header configuration
- **Trigger**: User enters a URL and clicks "Analyze"
- **Progression**: Input URL → Check for security headers (CSP, HSTS, X-Frame-Options, etc.) → Calculate security score → Display findings with descriptions → Save to history
- **Success criteria**: Shows which security headers are present/missing with explanations and overall security grade

### WHOIS Lookup
- **Functionality**: Retrieves domain registration and ownership information
- **Purpose**: Provides transparency about domain ownership, registration dates, and administrative contacts
- **Trigger**: User enters a domain and clicks "Lookup"
- **Progression**: Input domain → Fetch WHOIS data → Display registrar, dates, status, nameservers, registrant info → Save to history
- **Success criteria**: Shows comprehensive registration details in an organized, readable format

### Subdomain Finder
- **Functionality**: Discovers active subdomains for a given domain by checking common subdomain patterns
- **Purpose**: Helps users map the subdomain structure of a target domain
- **Trigger**: User enters a domain and clicks "Scan"
- **Progression**: Input domain → Test common subdomains (www, mail, api, admin, etc.) → Display active subdomains with IP addresses → Show progress bar → Save to history
- **Success criteria**: Shows list of discovered active subdomains with their resolved IP addresses

### DNS Records Lookup
- **Functionality**: Retrieves all DNS records (A, AAAA, MX, TXT, NS, CNAME, SOA) for a domain
- **Purpose**: Provides complete DNS configuration visibility for security assessment
- **Trigger**: User enters a domain and clicks "Lookup"
- **Progression**: Input domain → Query Google DNS API for all record types → Display records grouped by type with TTL values → Save to history
- **Success criteria**: Shows comprehensive DNS records with visual categorization by record type

### DNS Propagation Checker
- **Functionality**: Checks DNS propagation across multiple DNS servers worldwide (Google DNS, Cloudflare, Quad9, OpenDNS, Level3, Comodo, DNS.WATCH, Verisign, AdGuard, CleanBrowsing)
- **Purpose**: Helps users verify that DNS changes have propagated across different DNS servers globally
- **Trigger**: User enters a domain, selects record type (A, AAAA, CNAME, MX, TXT), and clicks "Check"
- **Progression**: Input domain → Select record type → Query 10 different DNS servers simultaneously → Show real-time progress → Display results with status indicators → Calculate propagation percentage → Save to history
- **Success criteria**: Shows propagation status for each server with response times, identifies mismatches, displays overall propagation percentage

### Robots.txt Analyzer
- **Functionality**: Fetches and parses robots.txt file to identify crawling rules and restricted paths
- **Purpose**: Reveals potentially sensitive directories and sitemap locations
- **Trigger**: User enters a domain and clicks "Check"
- **Progression**: Input domain → Fetch robots.txt → Parse disallowed paths, allowed paths, sitemaps → Display organized results → Save to history
- **Success criteria**: Shows parsed robots.txt with highlighted sitemaps and restricted paths, handles missing files gracefully

### Technology Stack Detector
- **Functionality**: Analyzes HTML, headers, and response patterns to identify technologies used by a website
- **Purpose**: Helps users understand the technology stack for vulnerability research
- **Trigger**: User enters a domain and clicks "Detect"
- **Progression**: Input domain → Fetch page and analyze headers → Detect frameworks, libraries, CMS, servers, CDN → Display with confidence levels → Save to history
- **Success criteria**: Shows detected technologies with categories (Frontend, Backend, Server, CDN) and confidence ratings

### Network Info Dashboard
- **Functionality**: Displays information about the user's own connection
- **Purpose**: Gives users quick insight into their own network details
- **Trigger**: Automatically loads on app mount
- **Progression**: App loads → Fetch user's public IP → Display IP, location, and connection details → Update periodically
- **Success criteria**: Accurately shows user's public-facing network information

### History/Recent Scans
- **Functionality**: Maintains a log of previous lookups and scans with click sound effects
- **Purpose**: Allows users to quickly re-check previous targets or review past results
- **Trigger**: Automatically saves each successful scan
- **Progression**: User completes scan → Result saved to KV storage → Displayed in history sidebar → User can click to reload with sound feedback
- **Success criteria**: Persists between sessions, displays timestamp and key details, allows quick re-scanning, provides audio feedback

## Edge Case Handling

- **Invalid Input** - Shows friendly error message with Miku character providing guidance
- **API Failures** - Graceful degradation with cached/simulated data and retry options
- **Empty States** - Encourages first action with welcoming Miku illustration and clear CTAs
- **Rate Limiting** - Prevents spam scanning with cooldown timers and visual feedback
- **Long Domain Names** - Truncates with tooltips to maintain layout integrity

## Design Direction

The design should feel like a high-tech anime interface - think cyberpunk meets kawaii. Vibrant teal and cyan colors inspired by Miku's signature look, with electric accents and glowing effects. The interface should feel futuristic yet playful, with smooth animations and a sense of digital energy.

## Color Selection

A vibrant, high-energy palette centered around Hatsune Miku's signature teal with electric accents and dark backgrounds for contrast.

- **Primary Color**: Electric Teal `oklch(0.65 0.15 195)` - Miku's signature color, used for primary actions and key UI elements, communicates energy and technological precision
- **Secondary Colors**: 
  - Deep Navy `oklch(0.15 0.02 250)` - Main background, provides dramatic contrast for teal elements
  - Soft Cyan `oklch(0.75 0.10 210)` - Secondary elements and hover states, lighter companion to primary
- **Accent Color**: Hot Pink `oklch(0.70 0.20 340)` - Attention-grabbing highlights for CTAs, success states, and Miku character elements
- **Foreground/Background Pairings**: 
  - Primary Teal `oklch(0.65 0.15 195)` on Deep Navy `oklch(0.15 0.02 250)`: White text `oklch(0.98 0 0)` - Ratio 8.2:1 ✓
  - Hot Pink `oklch(0.70 0.20 340)` on Deep Navy: White text `oklch(0.98 0 0)` - Ratio 7.9:1 ✓
  - Card backgrounds `oklch(0.20 0.02 250)` on Deep Navy: Teal text - Ratio 5.1:1 ✓

## Font Selection

Typefaces should blend technical precision with playful personality - a modern geometric sans for clean readability paired with slightly rounded characteristics that soften the techy aesthetic.

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold/32px/tight tracking/-0.02em
  - H2 (Section Headers): Space Grotesk Semibold/24px/tight tracking
  - H3 (Card Titles): Space Grotesk Medium/18px/normal tracking
  - Body (Results/Info): Inter Regular/14px/relaxed leading/1.6
  - Labels: Inter Medium/12px/wide tracking/0.05em uppercase
  - Monospace (IPs/Ports): JetBrains Mono Regular/14px - for technical data display

## Animations

Animations should feel snappy and cyberpunk-inspired with glowing effects and electrical energy. Use them to:
- **Scan Progress**: Pulsing glow effect on active scan buttons with a circular progress indicator
- **Results Entry**: Stagger animation for port results appearing one-by-one with a subtle slide-in
- **Miku Reactions**: Idle floating animation for Miku character, excited bounce on successful scans
- **Hover States**: Subtle glow and scale on interactive elements (1.02x scale, cyan outer glow)
- **Tab Transitions**: Quick fade with slight horizontal slide (200ms ease-out)
- **Card Entry**: Cards fade up from bottom with stagger delay (100ms per card)
- **Sound Effects**: Synthesized audio feedback for button clicks, scan start, scan completion, errors, and success states using Web Audio API

## Component Selection

- **Components**:
  - `Card` - Main container for each utility tool, with dark background and subtle teal border glow
  - `Tabs` - Switch between different network tools (Domain Lookup, Port Scanner, SSL Checker, Headers Analyzer, WHOIS, Subdomain Finder, DNS Records, Robots.txt, Tech Stack, My Network)
  - `Input` - Text fields for domain/IP/URL entry, with focus glow effect
  - `Button` - Primary actions with gradient hover states and loading spinners
  - `Badge` - Status indicators for ports (open/closed), SSL validity, security scores, DNS record types, confidence levels, styled with appropriate colors
  - `ScrollArea` - History sidebar and long result lists with smooth scrolling
  - `Separator` - Dividers between sections with subtle teal glow
  - `Progress` - Loading bars for scan progress with animated gradient
  - `Avatar` - Miku character icon in header
  - `Alert` - Error and info messages with Miku providing context

- **Customizations**:
  - Custom Miku character SVG illustrations for different states (idle, scanning, success, error)
  - Animated background with subtle grid pattern and moving particles
  - Glowing border effect on Cards using box-shadow with teal
  - Custom port status visualization with icon indicators

- **States**:
  - Buttons: Rest (teal gradient), Hover (brighter glow + scale), Active (pressed inset), Loading (spinner + disabled), Disabled (muted opacity)
  - Inputs: Rest (subtle border), Focus (cyan glow border), Error (pink border + shake), Success (green check icon)
  - Cards: Rest (dark bg), Hover (subtle teal glow border), Active (stronger glow when scanning)

- **Icon Selection**:
  - `GlobeHemisphereWest` - Domain lookup tool
  - `Broadcast` - Port scanner tool
  - `ShieldCheck` - SSL/TLS checker tool
  - `Article` - HTTP headers analyzer tool
  - `IdentificationCard` - WHOIS lookup tool
  - `Tree` - Subdomain finder tool
  - `Database` - DNS records lookup tool
  - `Robot` - Robots.txt analyzer tool
  - `Code` - Technology stack detector tool
  - `WifiHigh` - Network info
  - `ClockCounterClockwise` - History sidebar
  - `MagnifyingGlass` - Search/scan action
  - `CheckCircle` - Success states
  - `XCircle` - Error states
  - `LockKey` - Closed ports
  - `LockKeyOpen` - Open ports
  - `ShieldWarning` - Security warnings

- **Spacing**:
  - Page padding: p-6 (24px)
  - Card padding: p-6 (24px)
  - Section gaps: gap-6 (24px)
  - Element gaps: gap-4 (16px)
  - Tight groups: gap-2 (8px)

- **Mobile**:
  - Stack tabs vertically on mobile
  - History sidebar becomes a slide-out drawer
  - Reduce padding to p-4
  - Single column layout for all cards
  - Miku character hidden on very small screens
  - Touch-friendly button sizes (min 44px height)
