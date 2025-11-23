# 🎨 Radio UI - Visual Reference Guide

## Component Showcase

### Header Section
```
┌─────────────────────────────────────────────────────────────────┐
│ 🎙️ Quran Radio                        🔍 Search stations...    │
│    24/7 Quran recitations from the world's finest reciters      │
└─────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- Icon badge (emerald background)
- Gradient text title
- Search with icon prefix
- Subtitle with value proposition

---

### Hero Section
```
┌──────────────────────────────────────────────────────────────┐
│  ╔════════════════════════════════════════════════════════╗  │
│  ║  Begin Your Journey                 ▶ Start Listening  ║  │
│  ║  Experience pristine Quran recitations from the        ║  │
│  ║  world's finest reciters, all available 24/7           ║  │
│  ╚════════════════════════════════════════════════════════╝  │
│  [Emerald to Teal Gradient Background with Float Animation]   │
└──────────────────────────────────────────────────────────────┘
```

**Visual Properties:**
- Gradient: emerald → teal
- Rounded: 2xl (12px)
- Padding: 32px (8) sm:48px (12)
- Shadow: 2xl (25px spread)
- Button: White text, emerald hover

---

### Featured Sections
```
┌─ Continue Listening ─────────────────────────────────────────┐
│ ╭──────────────╮  ╭──────────────╮  ╭──────────────╮        │
│ │              │  │              │  │              │  (3+)   │
│ │  Station 1   │  │  Station 2   │  │  Station 3   │        │
│ │  📊 Progress │  │  📊 Progress │  │  📊 Progress │        │
│ ╰──────────────╯  ╰──────────────╯  ╰──────────────╯        │
└─────────────────────────────────────────────────────────────┘
```

---

### Station Card (Grid View)
```
┌─ Station Card ──────────────────────────┐
│ ┌───────────────────────────────────┐   │
│ │                                   │   │
│ │     [Album Art / Gradient]   ▶    │   │
│ │     🎙️ on hover               ●   │   │
│ │                              LIVE │   │
│ ├───────────────────────────────────┤   │
│ │ Station Title                     │   │
│ │ Subtitle (reciter name)           │   │
│ │ [Popular] [Friday]         +1     │   │
│ │ 📊 1.2K listeners                 │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Hover Effects:**
- Scale: 105%
- Translate: -4px (up)
- Shadow: md → xl
- Play button opacity: 0 → 100%
- Live badge appears

---

### Featured Card (Horizontal)
```
┌─ Featured Card ──────────────────────────────┐
│ ┌──────────────────────────────────────────┐ │
│ │                                          │ │
│ │        [Album Art / Gradient]      ▶    │ │
│ │        Beautiful 16:9 Ratio           ●  │ │
│ │                                        ● │ │
│ │    Station Title                     16 │ │
│ │    Subtitle                            │ │
│ │    [Featured Badge]                    │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

### Full Player
```
┌────────────────────────────────────────────┐
│                                            │
│        ╔═══════════════════╗               │
│        ║                   ║ ✨ Glowing    │
│        ║   Album Art       ║ Backdrop      │
│        ║   (320×320)       ║               │
│        ║                   ║               │
│        ╚═══════════════════╝               │
│                                            │
│    Surah Al-Kahf                           │
│    Mishari Rashid Al-Afasy                 │
│                                            │
│    ┌──────────────────────────────┐        │
│    │███████████░░░░░░░░░░░░░░░░░│ (75%)   │
│    └──────────────────────────────┘        │
│    0:42 / 10:00                            │
│                                            │
│  ⏮  ⏸  ⏭                                   │
│ [BIG PLAY BUTTON]                         │
│                                            │
│  Speed:    [0.8x] 1x [1.25x]              │
│  Quality:  [High] Low                      │
│                                            │
│  [🔁 Loop]  [🔀 Shuffle]                  │
│                                            │
│  ↓ Minimize Player                        │
└────────────────────────────────────────────┘
```

---

### Mini Player
```
┌────────────────────────────────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░ (50%)            │
├────────────────────────────────────────────────────────────────┤
│ ♫  │ Surah Al-Kahf               │ 00:42 / 10:00 │ ⏮ ⏸ ⏭    │
│    │ Mishari Rashid Al-Afasy    │                │            │
└────────────────────────────────────────────────────────────────┘
```

**Responsive:**
```
Mobile (< 640px):
- Thumbnail: 48px
- Font: text-xs
- Time: hidden in very tight space

Desktop (sm: 640px+):
- Thumbnail: 56px  
- Font: text-sm
- Time: visible with full format
```

---

## Color Reference

### Primary Gradient
```
from-emerald-500  ──→  via-emerald-600  ──→  to-teal-600
#10B981               #059669               #14B8A6

Visual: Deep green → Darker green → Teal
```

### Text Colors
```
Primary:   slate-900   (#0F172A) - Titles, headers
Secondary: slate-600   (#475569) - Body text
Muted:     slate-500   (#64748B) - Hints, secondary info
Light:     slate-400   (#94A3B8) - Disabled state
```

### Backgrounds
```
Primary:   white       (#FFFFFF) - Cards, containers
Secondary: slate-50    (#F8FAFC) - Page background
Accent:    emerald-50  (#F0FDF4) - Hover backgrounds
Active:    emerald-100 (#DCFCE7) - Active states
```

### Status Colors
```
Active:    emerald-500 (#10B981) - Playing, active
Inactive:  slate-300   (#CBD5E1) - Disabled
Success:   emerald-600 (#059669) - Confirmed
Info:      cyan-500    (#06B6D4) - Information
Warning:   amber-500   (#F59E0B) - Alert
Danger:    red-500     (#EF4444) - Error
```

---

## Shadow System

### Shadow Levels
```
Subtle (md):
  0 4px 6px -1px rgba(0, 0, 0, 0.1);
  Default for cards

Medium (lg):
  0 10px 15px -3px rgba(0, 0, 0, 0.1);
  Hover state for cards

Large (xl):
  0 20px 25px -5px rgba(0, 0, 0, 0.1);
  Featured sections, full player

Extreme (2xl):
  0 25px 50px -12px rgba(0, 0, 0, 0.25);
  Buttons, hero sections, modals
```

---

## Typography Scale

```
Hero Title:      48px (3rem)    font-bold   text-4xl sm:text-5xl
Section Title:   24px (1.5rem)  font-bold   text-2xl
Card Title:      16px (1rem)    font-bold   text-base
Subtitle:        14px (0.875)   font-medium text-sm
Body:            14px (0.875)   font-normal text-sm
Small:           12px (0.75)    font-normal text-xs
Badge:           12px (0.75)    font-bold   text-xs
```

---

## Spacing Reference

```
xs  0.25rem  (2px)
sm  0.5rem   (4px)
md  1rem     (8px)  ← Default
lg  1.5rem   (12px)
xl  2rem     (16px)
2xl 2.5rem   (20px)
3xl 3rem     (24px)
4xl 3.5rem   (28px)
```

---

## Border Radius Guide

```
Buttons (Hero):       rounded-full    - 9999px
Buttons (Standard):   rounded-lg      - 8px
Buttons (Secondary):  rounded-xl      - 12px
Cards:                rounded-xl      - 12px
Featured:             rounded-2xl     - 16px
Inputs:               rounded-xl      - 12px
Badges:               rounded-full    - 9999px
```

---

## Animation Timing

### Durations
```
Instant:    50ms    - Immediate feedback
Fast:       200ms   - Button clicks
Standard:   300ms   - Most transitions
Slow:       400ms   - Hover card effects
Slow+:      500ms   - Entrance animations
Very Slow:  700ms   - Image zoom
Crawl:      2s      - Continuous pulse
```

### Easing Functions
```
Linear:       cubic-bezier(0, 0, 1, 1)
Ease-in:      cubic-bezier(0.42, 0, 1, 1)
Ease-out:     cubic-bezier(0, 0, 0.58, 1)
Ease-in-out:  cubic-bezier(0.42, 0, 0.58, 1)
```

---

## Responsive Grid

```
Mobile (default):
┌─────────────┐
│   Card      │
│  (100%)     │
├─────────────┤
│   Card      │
│  (100%)     │
└─────────────┘

Tablet (sm: 640px):
┌──────────┬──────────┐
│  Card    │  Card    │
│ (50%)    │ (50%)    │
├──────────┼──────────┤
│  Card    │  Card    │
│ (50%)    │ (50%)    │
└──────────┴──────────┘

Desktop (lg: 1024px):
┌────────┬────────┬────────┐
│ Card   │ Card   │ Card   │
│(33%)   │(33%)   │(33%)   │
├────────┼────────┼────────┤
│ Card   │ Card   │ Card   │
│(33%)   │(33%)   │(33%)   │
└────────┴────────┴────────┘

Wide (xl: 1280px):
┌──────┬──────┬──────┬──────┐
│Card  │Card  │Card  │Card  │
│(25%) │(25%) │(25%) │(25%) │
├──────┼──────┼──────┼──────┤
│Card  │Card  │Card  │Card  │
│(25%) │(25%) │(25%) │(25%) │
└──────┴──────┴──────┴──────┘
```

---

## Interactive States

### Button States
```
Idle:       bg-slate-200 text-slate-900 shadow-md
Hover:      bg-slate-300 shadow-lg scale-110
Active:     scale-95
Focus:      outline-2 outline-offset-2 outline-emerald-500
Disabled:   opacity-50 cursor-not-allowed
```

### Card States
```
Idle:       shadow-md border-slate-200
Hover:      shadow-xl border-emerald-300 scale-105 -translate-y-1
Focus:      outline-2 outline-emerald-500
Active:     scale-100 (return to normal)
```

---

## Icon Sizing

```
Inline (text):    16px (h-4 w-4)
Buttons:          20px (h-5 w-5)
Large Buttons:    24px (h-6 w-6)
Badges:           16px (h-4 w-4)
Hero:             24px (h-6 w-6)
Play Buttons:     24px (inline), 40px+ (standalone)
```

---

## Example Component Code

### Button Variants
```tsx
// Primary Emerald Button
<button className="px-8 py-4 rounded-full bg-emerald-600 
                   hover:bg-emerald-700 text-white font-bold
                   hover:scale-110 active:scale-95
                   shadow-md hover:shadow-lg
                   transition-all duration-300">
  Action
</button>

// Secondary Slate Button
<button className="px-6 py-2 rounded-lg bg-slate-200
                   hover:bg-slate-300 text-slate-900 font-semibold
                   hover:scale-105 active:scale-95
                   transition-all duration-200">
  Secondary
</button>

// Icon Button
<button className="p-2.5 rounded-full hover:bg-emerald-100
                   text-emerald-600 hover:text-emerald-700
                   transition-all hover:scale-110">
  <Icon />
</button>
```

---

## Performance Tips

1. **Use CSS transforms** for animations (scale, translate)
2. **Avoid animating** width/height properties
3. **Use will-change** sparingly for complex animations
4. **Lazy load** images with `loading="lazy"`
5. **Debounce** resize listeners
6. **Use** `transition-all` with explicit durations
7. **Keep animations** under 500ms for UI feedback
8. **Test** on actual mobile devices for 60fps

---

This visual reference guide provides everything needed to maintain and extend the radio UI design system consistently.
