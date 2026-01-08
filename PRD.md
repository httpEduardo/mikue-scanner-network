# Security Toolkit - Product Requirements Document

A comprehensive network security scanning and analysis toolkit that provides DNS propagation checks, HTTP/TLS verification, security headers analysis, and controlled port discovery.

**Experience Qualities**:
1. **Professional** - Clean, technical interface that conveys expertise and trustworthiness
2. **Informative** - Rich data presentation with clear visual hierarchy and status indicators
3. **Responsive** - Real-time feedback with progress tracking and scan history

**Complexity Level**: Light Application (multiple features with basic state)
The toolkit offers several scanning modules with job queue simulation and persistent scan history, but maintains a straightforward single-page interface.

## Essential Features

### Scan Creation & Execution
- **Functionality**: Users select scan type, enter target domain/IP, configure options, and initiate scans
- **Purpose**: Provide controlled security reconnaissance within guardrails
- **Trigger**: Click "Run Scan" button after filling form
- **Progression**: Form input → Validation → Queue scan → Show progress → Display results
- **Success criteria**: Scan completes successfully and shows actionable results

### DNS Propagation Checker
- **Functionality**: Queries multiple DNS resolvers to detect propagation inconsistencies
- **Purpose**: Identify DNS configuration issues and propagation delays
- **Trigger**: Select "DNS Propagation" scan type
- **Progression**: Enter domain → Select record type (A/AAAA/CNAME/MX/TXT/NS) → Execute → Compare resolver responses
- **Success criteria**: Shows which resolvers return matching/mismatched values

### HTTP/TLS Scanner
- **Functionality**: Analyzes HTTPS connections, certificate validity, and TLS configuration
- **Purpose**: Verify secure connections and certificate health
- **Trigger**: Select "HTTP/TLS" scan type
- **Progression**: Enter domain → Execute → Fetch certificate details → Display validity dates, issuer, protocol version
- **Success criteria**: Shows certificate information and connection security status

### Security Headers Analyzer
- **Functionality**: Checks for presence of critical security headers (HSTS, CSP, X-Frame-Options, etc.)
- **Purpose**: Identify missing security hardening measures
- **Trigger**: Select "Security Headers" scan type
- **Progression**: Enter domain → Execute → Fetch headers → Validate against best practices → Show missing/present headers
- **Success criteria**: Color-coded list of security headers with recommendations

### Port Discovery (Controlled)
- **Functionality**: Tests connectivity to predefined port sets (web profile, basic profile)
- **Purpose**: Identify open services on authorized targets
- **Trigger**: Select "Port Discovery" scan type
- **Progression**: Enter target → Select profile (basic/web) → Execute → Test each port → Display open/closed/filtered status
- **Success criteria**: Shows port states with response times

### Scan History & Management
- **Functionality**: Persists scan results, allows viewing past scans, and provides quick re-run
- **Purpose**: Track reconnaissance work over time
- **Trigger**: Automatic on scan completion
- **Progression**: Scan completes → Store in KV → Display in sidebar → Click to view details
- **Success criteria**: History persists across sessions and displays all scan metadata

## Edge Case Handling
- **Invalid Targets**: Validate domain/IP format before allowing scan execution
- **Network Failures**: Display clear error messages when scans fail with retry option
- **Empty Results**: Show helpful "no data" states when scans return empty
- **Concurrent Scans**: Disable form during active scan to prevent conflicts
- **Long-Running Scans**: Show progress indicators and allow cancellation

## Design Direction
The design should evoke a sense of technical precision and professional security tooling. Think cybersecurity command center meets modern SaaS - clean, data-dense, with subtle tech aesthetics (grid patterns, monospace fonts for technical data, status color coding). The interface should feel powerful yet approachable.

## Color Selection
Dark theme with cyan/blue accents and semantic status colors.

- **Primary Color**: `oklch(0.65 0.15 195)` - Cyan blue communicating technology, trust, and security
- **Secondary Color**: `oklch(0.75 0.10 210)` - Lighter blue for secondary actions and hover states
- **Accent Color**: `oklch(0.70 0.20 340)` - Pink/magenta for highlights and active states, creating contrast against blue
- **Foreground/Background Pairings**:
  - Background `oklch(0.15 0.02 250)`: Foreground `oklch(0.98 0 0)` - Ratio 13.8:1 ✓
  - Card `oklch(0.20 0.02 250)`: Card-foreground `oklch(0.98 0 0)` - Ratio 12.1:1 ✓
  - Primary `oklch(0.65 0.15 195)`: Primary-foreground `oklch(0.98 0 0)` - Ratio 5.2:1 ✓
  - Accent `oklch(0.70 0.20 340)`: Accent-foreground `oklch(0.98 0 0)` - Ratio 6.1:1 ✓

## Font Selection
Technical precision with readability - Space Grotesk for headings (geometric, tech-forward), Inter for body (clean readability), JetBrains Mono for code/data.

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold / 24px / tight tracking
  - H2 (Card Titles): Space Grotesk SemiBold / 20px / normal tracking
  - H3 (Section Headers): Space Grotesk SemiBold / 16px / normal tracking
  - Body Text: Inter Regular / 14px / 1.5 line height
  - Small Text: Inter Regular / 12px / 1.4 line height
  - Code/Data: JetBrains Mono Regular / 13px / monospace

## Animations
Animations should emphasize system status and data flow. Use subtle transitions for state changes (200-300ms), progress indicators for active scans, and gentle floating effects for decorative elements. Avoid distracting motion - animations should guide attention to status changes and new results.

## Component Selection
- **Components**: Card (scan modules), Tabs (switching scan types), Select (dropdowns for options), Input (target entry), Button (actions), Badge (status indicators), Progress (scan progress), ScrollArea (long results), Alert (errors/warnings), Separator (visual breaks)
- **Customizations**: Custom scan result cards with color-coded status, animated grid background, custom progress indicators with glow effects
- **States**: 
  - Buttons: Default (subtle border), Hover (glow + brightness), Active (pressed depth), Disabled (muted opacity)
  - Inputs: Default (border), Focus (primary ring + glow), Error (red border), Filled (subtle highlight)
- **Icon Selection**: Phosphor icons duotone weight - GlobeHemisphereWest (DNS), ShieldCheck (TLS), Article (Headers), Broadcast (Ports), ClockCounterClockwise (History)
- **Spacing**: Base unit 4px (Tailwind scale) - generous padding in cards (p-6), consistent gaps (gap-4), comfortable form spacing (space-y-3)
- **Mobile**: Stack form fields vertically on mobile, collapsible sidebar becomes bottom sheet, tabs scroll horizontally with snap points
