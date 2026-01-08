# Planning Guide

A playful Hatsune Miku-themed network utility dashboard where Miku assists users with network diagnostics and information gathering tasks.

**Experience Qualities**:
1. **Kawaii** - Embraces vibrant teal/cyan aesthetics with playful anime-inspired UI elements that feel energetic and fun
2. **Helpful** - Provides useful network utilities in an approachable, non-intimidating way with clear results and explanations
3. **Interactive** - Features responsive animations and delightful micro-interactions that make technical tasks feel engaging

**Complexity Level**: Light Application (multiple features with basic state)
This is a utility dashboard with several distinct network tools that maintain state for history and results, but doesn't require complex data relationships or multi-view navigation beyond tabs/sections.

## Essential Features

### Domain/IP Lookup
- **Functionality**: Resolves domain names to IP addresses and provides geographic information
- **Purpose**: Allows users to discover the IP address and location data for any website
- **Trigger**: User enters a domain name (e.g., example.com) and clicks "Scan"
- **Progression**: Input domain → Validate input → Fetch IP data via API → Display IP, location, ISP info → Save to history
- **Success criteria**: Displays accurate IP address and related information, handles invalid domains gracefully

### Port Scanner
- **Functionality**: Checks common ports (80, 443, 22, 21, 3306, etc.) for a given IP/domain
- **Purpose**: Helps users identify which services are potentially accessible on a target
- **Trigger**: User enters IP/domain and optionally selects ports to scan
- **Progression**: Input target → Select port range → Simulate port checks → Display open/closed status with service names → Animate results appearing
- **Success criteria**: Shows clear visual indication of port status with recognizable service labels

### Network Info Dashboard
- **Functionality**: Displays information about the user's own connection
- **Purpose**: Gives users quick insight into their own network details
- **Trigger**: Automatically loads on app mount
- **Progression**: App loads → Fetch user's public IP → Display IP, location, and connection details → Update periodically
- **Success criteria**: Accurately shows user's public-facing network information

### History/Recent Scans
- **Functionality**: Maintains a log of previous lookups and scans
- **Purpose**: Allows users to quickly re-check previous targets or review past results
- **Trigger**: Automatically saves each successful scan
- **Progression**: User completes scan → Result saved to KV storage → Displayed in history sidebar → User can click to reload
- **Success criteria**: Persists between sessions, displays timestamp and key details, allows quick re-scanning

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

## Component Selection

- **Components**:
  - `Card` - Main container for each utility tool, with dark background and subtle teal border glow
  - `Tabs` - Switch between different network tools (Lookup, Port Scan, My Network)
  - `Input` - Text fields for domain/IP entry, with focus glow effect
  - `Button` - Primary actions with gradient hover states and loading spinners
  - `Badge` - Status indicators for ports (open/closed), styled with appropriate colors
  - `ScrollArea` - History sidebar with smooth scrolling
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
  - `WifiHigh` - Network info
  - `ClockCounterClockwise` - History sidebar
  - `MagnifyingGlass` - Search/scan action
  - `CheckCircle` - Success states
  - `XCircle` - Error states
  - `LockKey` - Open ports
  - `LockKeyOpen` - Closed ports

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
