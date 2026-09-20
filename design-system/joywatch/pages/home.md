# Joywatch Home & Player UI Specification
*Derived from UI/UX Pro Max Design Intelligence*

## Visual Style: Aurora Cinematic Glassmorphism (Liquid Glass & Bento)
- **Palette**:
  - Base Obsidian: `#08090D` (Page background)
  - Surface Glass: `rgba(255, 255, 255, 0.035)`
  - Surface Glass Elevated: `rgba(255, 255, 255, 0.07)`
  - Surface Glass Hover: `rgba(255, 255, 255, 0.1)`
  - Border Glass: `rgba(255, 255, 255, 0.08)`
  - Border Glass Glowing: `rgba(99, 102, 241, 0.4)`
  - Accent Primary: `#6366F1` (Electric Indigo)
  - Accent Joy / Gradient: `linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #F59E0B 100%)`
  - Accent Secondary: `#06B6D4` (Luminous Cyan)
  - Text Primary: `#F8FAFC`
  - Text Secondary: `#94A3B8`
  - Text Muted: `#64748B`

## Typography:
- **Display & Headings**: `Outfit`, sans-serif (Weights: 600, 700, 800)
- **Body & Controls**: `Inter`, sans-serif (Weights: 400, 500, 600)
- Google Fonts Import:
  `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');`

## Unique Components:
1. **Floating Aurora Navbar**:
   - Translucent frosted glass capsule with blurred backdrop (`backdrop-filter: blur(24px)`)
   - Logo: Glowing Joywatch icon + gradient brand typography
   - Floating pill navigation tabs: Discover, Movies, Series, Anime, JoyList
   - Expandable glass search bar with glowing focus ring and clear button
   - Status indicator / connection badge
2. **Hero Ambient Canvas**:
   - Organic curved backdrop with subtle aurora gradient lighting
   - Floating metadata badges (IMDb score pill, 4K HDR badge, release year, genre tags)
   - Dual action buttons: Glowing gradient "Watch Now" button + Frosted "More Details" button
3. **Bento Spotlight Bar**:
   - Curated highlights: "Weekly Top Pick", "Continue Journey", "Trending Pulse"
4. **Cinematic Smooth Shelves**:
   - Modern curved poster cards (`border-radius: 16px`)
   - Shimmer placeholder loader
   - Micro-interaction on hover: smooth lift, glowing perimeter shadow, quick-play floating pill
5. **Modal Cinema Sanctuary**:
   - Glassmorphic modal with ambient backdrop blur
   - Stream source pills with badges ("⚡ Instant Play", "1080p Ultra HD", "🎬 VLC Direct")
   - Season & episode picker with clean card layout
6. **Immersive Video Player**:
   - Minimalist top bar with Joywatch branding, back button, and VLC switcher
   - Fullscreen iframe/video playback with 0 layout shift
