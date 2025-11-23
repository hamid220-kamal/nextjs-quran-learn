# Copilot Instructions for QuranicLearn

## Architecture Overview

**QuranicLearn** is a Next.js 15+ app using the App Router for interactive Quranic learning with audio recitations. Key components:

- **Server-side data fetching**: `src/app/quran/page.tsx` fetches initial Quran structure via `fetchQuranStructure()` 
- **Client-side UI**: `src/app/quran/QuranClient.tsx` manages state for surahs, search, and navigation views
- **API routes**: `src/app/api/` contains data endpoints (quran-audio, ruku, prayer-time)
- **Utilities**: `src/utils/` contains core services (quranApi.ts, audio handling, fetchers)
- **External API**: Uses **alquran.cloud/api** (primary) and fallback CDN for Quran data; **everyayah.com** CDN for audio files
- **Radio Module**: `src/app/radio/` - Modern streaming player with stations, featured content, and mini/full player modes

## Critical Patterns

### Data Fetching Strategy
- **Server-side**: Use `fetchQuranStructure()`, `fetchSurahs()`, `fetchSurah()` from `src/utils/quranApi.ts` for initial page loads
- **Client-side**: Use React hooks in `'use client'` components for search, filtering, and pagination
- **Retry logic**: `fetchWithRetry()` with exponential backoff (max 3 retries, 10s timeout) - handles API failures gracefully
- **Audio sourcing**: Routes through `/api/quran-audio` which maps reciter IDs to `everyayah.com` CDN directories

### Audio Playback
- Audio routes have reciter mappings (e.g., `'7': 'Alafasy_128kbps'`); verse numbers are 0-padded (001001.mp3 format)
- Fallback mechanisms in `src/utils/` handle missing verses (see `verseAudioFallbacks.ts`, `problematicVerseHandler.ts`)
- Components: `QuranAudioPage.jsx`, `AudioPlayer.tsx`, `SurahAudioPlayer.tsx`

### Radio Module UI Architecture
- **State Management**: `PlayerState.tsx` provides global player context (playlist, isPlaying, currentTime, loop, shuffle)
- **Full Player**: `FullPlayer.tsx` - Large immersive view with cover art, metadata, speed/quality controls
- **Mini Player**: `MiniPlayer.tsx` - Fixed bottom bar with progress, compact controls, always-visible during playback
- **Station Cards**: Three variants:
  - `StationCard.tsx` - Grid view with metadata, tags, listener count
  - `StationFeaturedCard.tsx` - Horizontal featured card with overlay play button
  - `StationMiniCard.tsx` - Compact card for "Continue Listening" section
- **Styling**: Tailwind CSS with emerald/teal gradient theme; smooth hover animations, shadow depth progression

### Component Structure
- **'use client' components**: `QuranClient.tsx`, `FullPlayer.tsx`, `MiniPlayer.tsx`, client-side hooks
- **Server components**: `page.tsx` files (SSR), `Navbar`, `Footer`
- **Styling**: CSS modules + global CSS; Tailwind for utilities
- **Radio routes**: `/radio` - main page, `/radio/[stationId]` - station detail page

## Build & Deployment

- **Dev**: `npm run dev` (localhost:3000)
- **Build**: `npm run build` (ignores ESLint/TS errors via next.config.js - intentional)
- **Lint**: `npm run lint` (uses next lint)
- **Important**: Both `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` are **true** - production builds allow errors

## Key Conventions

1. **Path alias**: `@/*` maps to `src/` (configured in tsconfig.json & next.config.js)
2. **API data structure**: Surahs have properties like `number`, `englishName`, `name` (Arabic); use `@/types/quran.ts` for type safety
3. **Routing case-sensitivity**: Middleware redirects `/Quran` → `/quran` (POST-redirect via 307)
4. **Metadata**: Leverage Next.js `Metadata` API in page.tsx files (OG tags, canonical URLs)
5. **Radio Player State**: Always wrap player-dependent components with `PlayerProvider` in layout

## UI Design System (Radio Module)

- **Color Palette**: Emerald (#10B981) as primary, teal (#14B8A6) accents, slate grays for text
- **Shadows**: Progressive depth (md, lg, xl, 2xl) for layering; use 2xl for buttons, xl for cards
- **Typography**: Bold titles (font-bold), medium subtitles, small secondary text
- **Border Radius**: 2xl for hero sections, xl for major cards, lg for buttons
- **Hover Effects**: 
  - Cards: `scale-105 -translate-y-1 shadow-xl` with 400ms transition
  - Buttons: `scale-110` with color gradient shift
  - Images: `scale-110` with 700ms ease-out transform
- **Progress Indicators**: Gradient bars from emerald → teal with smooth width animation
- **Responsive**: Mobile-first (use `sm:`, `md:`, `lg:` prefixes); grid adjusts 1 → 2 → 3 → 4 columns

## External Dependencies

- **Animation**: framer-motion, react-swipeable
- **Icons**: lucide-react, react-icons
- **Styling**: Tailwind CSS 4.1+, PostCSS with autoprefixer
- **API clients**: node-fetch for server-side requests

## When Adding Features

- Check `src/utils/` first for existing fetchers and audio handlers before creating new ones
- Add new API routes to `src/app/api/` following the GET handler pattern in existing routes
- Update type definitions in `src/types/` when introducing new data structures
- For radio module: extend `PlayerState.tsx` for new player features, create component variants for different layouts
- Test audio URLs manually against everyayah.com CDN before committing
- Use consistent color scheme (emerald/teal) and shadow depths when adding UI elements
