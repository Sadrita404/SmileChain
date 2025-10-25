# SmileChain Design Guidelines

## Design Approach

**Reference-Based Approach:** Drawing inspiration from modern Web3 apps (Rainbow Wallet, Uniswap), gamification platforms (Duolingo), and social camera apps (Instagram Stories). The design balances playful engagement with the credibility needed for cryptocurrency handling.

**Core Design Principles:**
- Playful yet trustworthy: Fun smile-detection experience with professional crypto handling
- Instant feedback: Real-time visual response to user actions and smile scores
- Achievement-focused: Celebrate user success with prominent score displays and rewards
- Transparency: Clear token amounts, transaction states, and pool statistics

## Typography

**Font Stack:**
- Primary: 'Inter' or 'DM Sans' via Google Fonts (clean, modern Web3 aesthetic)
- Display/Scores: 'Space Grotesk' or 'Clash Display' (bold, attention-grabbing for numbers)

**Hierarchy:**
- Hero/Score Numbers: 3xl to 6xl, bold weight (smile scores, token amounts)
- Section Headers: 2xl to 3xl, semibold
- Card Titles: lg to xl, medium weight
- Body Text: base to lg, regular weight
- Captions/Metadata: sm to base, medium weight

## Layout System

**Spacing Primitives:** Tailwind units of 3, 4, 6, 8, 12, and 16
- Component padding: p-6 to p-8
- Section spacing: space-y-8 to space-y-12
- Card gaps: gap-4 to gap-6
- Button padding: px-6 py-3 to px-8 py-4

**Grid Structure:**
- Mobile: Single column, full-width cards
- Desktop: 2-column layout (camera/action left, stats/leaderboard right)
- Max container: max-w-7xl
- Camera viewport: Centered, max-w-md on desktop

## Component Library

### 1. Wallet Connection
- Prominent "Connect Wallet" button in top-right header
- Connected state shows abbreviated address + balance badge
- Network indicator (Celo Alfajores testnet)
- Disconnect option in dropdown

### 2. Camera Interface (Primary Feature)
- Large, centered camera viewport with rounded corners (rounded-2xl)
- Live camera feed with overlay frame/guide for face positioning
- Real-time smile detection indicator (subtle outline pulse when detecting face)
- Capture button: Large circular button below camera (h-16 w-16)
- Retake/confirm options post-capture

### 3. Smile Score Display
- Dramatic score reveal animation after capture
- Large numerical score (text-6xl to text-8xl) with percentage/100 scale
- Visual rating indicator: progress ring or bar showing score
- Emoji/icon feedback (😐 → 😊 → 😁 based on score tiers)
- Score threshold indicator (e.g., "80+ earns rewards!")

### 4. Reward Notification
- Toast/modal celebration when reward earned
- Token amount prominently displayed with Celo logo
- Transaction hash link to Celo explorer
- Success animation (confetti or token particle effect - keep brief)

### 5. Statistics Dashboard
- Personal stats card: Total smiles, average score, tokens earned
- Grid layout: 2x2 or 3-column stat boxes
- Large numbers with descriptive labels below
- Mini trend indicators (↑ arrows for improvements)

### 6. Donation Interface
- Input field with max button (donate all available tokens)
- Current pool size displayed prominently
- "Contribute to Pool" primary action button
- Next redistribution countdown timer
- Recent donations feed (optional scrollable list)

### 7. Leaderboard
- Top 10 ranked list with position badges
- Each entry: rank number, wallet address (abbreviated), smile score, rewards earned
- Highlight current user's position if in top 10
- Medal/trophy icons for top 3 positions
- Scrollable table with sticky header

### 8. Transaction States
- Loading states with spinner + "Processing on Celo..."
- Success states with checkmark + transaction details
- Error states with retry option

### 9. Navigation
- Fixed header with logo, wallet connection, and stats overview
- Bottom navigation on mobile (Camera, Stats, Donate, Leaderboard)
- Tab-based navigation on desktop

## Images

**Logo/Branding:**
- SmileChain logo in header: Combines smile icon + blockchain link visual
- Celo network badge/logo alongside wallet connection

**Camera Placeholder:**
- When camera not active: Friendly illustration or icon prompting user to start
- Face detection guide overlay: Subtle face outline/oval to guide positioning

**Empty States:**
- Leaderboard empty: Illustration encouraging first smile capture
- No tokens earned yet: Motivational graphic showing reward potential

**Achievement Icons:**
- Trophy/medal icons for leaderboard rankings
- Token/coin icons throughout for reward displays
- Smile emoji progression (low to high scores)

**Hero Section:** None required - this is an app interface, not a landing page. Primary focus is the camera interface as the hero element.

## Animations

**Essential Only:**
- Smile score reveal: 0.5s count-up animation
- Reward notification: Brief (0.3s) scale-in celebration
- Camera capture: Quick flash effect
- Loading spinners: Standard rotation for transactions
- No scroll-triggered animations, no continuous looping effects

## Accessibility

- Camera permissions prompt with clear explanation
- Keyboard navigation for all interactive elements
- ARIA labels for score announcements to screen readers
- High contrast for text over camera feed overlays
- Focus indicators on all buttons and inputs
- Error messages with clear recovery instructions