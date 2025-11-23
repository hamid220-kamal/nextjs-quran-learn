# Radio UI - Design System Reference

## Color Palette

### Primary Gradient
```
From: #10B981 (Emerald 500)
Via:  #059669 (Emerald 600)
To:   #14B8A6 (Teal 600)
```

### Secondary Colors
```
Emerald 50:  #F0FDF4 (light backgrounds)
Emerald 100: #DCFCE7 (hover states)
Slate 50:    #F8FAFC (backgrounds)
Slate 900:   #0F172A (text)
```

## Component Variants

### Button States

**Primary Action Button**
- Default: `bg-emerald-600 text-white hover:bg-emerald-700`
- Active: `scale-95`
- Disabled: `opacity-50 cursor-not-allowed`

**Secondary Button**
- Default: `bg-slate-200 text-slate-900 hover:bg-slate-300`
- Active: `scale-95`

**Icon Button**
- Default: `p-2.5 rounded-full hover:bg-emerald-100 text-emerald-600`
- Hover: `scale-110`

### Card Variants

**Station Card (Grid)**
```
Rounded: xl (0.75rem)
Shadow: md (default) → xl (hover)
Transform: scale-105 -translate-y-1
Transition: 400ms
```

**Featured Card (Horizontal)**
```
Rounded: xl
Aspect: 16/9
Shadow: lg (default) → 2xl (hover)
Transform: scale-105 -translate-y-2
Badge: Featured label on hover
```

**Mini Card (Compact)**
```
Similar to Station Card but smaller
Used in "Continue Listening" section
```

## Typography Scale

| Use Case | Class | Size | Weight |
|----------|-------|------|--------|
| Hero Title | text-4xl sm:text-5xl | 36/48px | bold |
| Section Title | text-2xl | 24px | bold |
| Card Title | text-sm/base | 14/16px | bold |
| Subtitle | text-sm | 14px | medium |
| Body | text-xs/sm | 12/14px | normal |
| Badge | text-xs | 12px | semibold |

## Spacing System

```
xs:  0.25rem (1px) - minimal
sm:  0.5rem  (2px)
md:  1rem    (4px) - default padding
lg:  1.5rem  (6px)
xl:  2rem    (8px)
2xl: 2.5rem  (10px)
3xl: 3rem    (12px)
```

## Shadow Depth

```
Flat:       no shadow
Subtle:     shadow-sm (cards on white)
Medium:     shadow-md (default cards)
Deep:       shadow-lg (hover states)
Very Deep:  shadow-xl (featured)
Extreme:    shadow-2xl (buttons, hero)
```

## Border Radius

```
Buttons:     rounded-full (hero, small)
             rounded-lg (control buttons)
             rounded-xl (secondary)
Cards:       rounded-xl (standard)
             rounded-2xl (hero section)
Inputs:      rounded-xl (search)
Icons:       rounded-lg/rounded-full
```

## Interactive States

### Hover
- Scale: 105-110%
- Shadow: +1-2 levels
- Color: Slightly darker/lighter
- Duration: 300-400ms

### Active/Press
- Scale: 95%
- Instant feedback

### Focus (Keyboard)
```
outline-2 outline-offset-2 outline-emerald-500
```

### Disabled
```
opacity-50 cursor-not-allowed
```

## Animation Library

| Animation | Duration | Timing | Use Case |
|-----------|----------|--------|----------|
| scale-105/110 | 300ms | ease-out | Card/button hover |
| -translate-y-1/2 | 400ms | ease-out | Card lift on hover |
| opacity transitions | 300ms | ease | Fade in/out |
| transform scale | 700ms | ease-out | Image zoom on hover |
| width transitions | 300ms | ease | Progress bar |
| pulse-gentle | 2s | infinite | Soft animations |

## Responsive Design

### Breakpoints
- **Mobile First**: Design for 320px+
- **sm**: 640px+ (tablets, small)
- **md**: 768px+ (tablets, medium)
- **lg**: 1024px+ (desktops)
- **xl**: 1280px+ (large desktops)

### Grid System (All Stations)
```
Mobile:  1 column  (full width - 16px margins)
Tablet:  2 columns (sm:)
Desktop: 3 columns (lg:)
Wide:    4 columns (xl:)
Gap:     16px (gap-4)
```

### Padding/Margins
```
Hero:    p-8 sm:p-12
Cards:   p-4
Sections: py-8 space-y-10
Header:  py-5 sm:py-6
Main:    pb-24 (account for mini player)
```

## Icon Usage

### Inline Icons
- Search: 20×20px, left-aligned with 12px padding
- Status: 16×16px, inline with text

### Buttons
- Play: 24px in circles
- Navigation: 16-20px
- Close: 20px

### Badges
- Size: 16×16px
- Pulse dot: 6×6px

## Accessibility Patterns

### Focus Rings
```
focus-visible:outline-2 focus-visible:outline-offset-2 
focus-visible:outline-emerald-500
```

### Contrast Ratios
- Text on emerald: 4.5:1+ (WCAG AA)
- Text on white: 7:1+ (WCAG AAA)
- Icon fills: Match text contrast

### Touch Targets
- Minimum: 44×44px
- Ideal: 48×48px
- Spacing: 8px minimum

## Gradient Combinations

### Emerald to Teal
```
from-emerald-500 via-emerald-600 to-teal-700
```

### For Inactive
```
from-slate-200 to-slate-300
```

### Accent (Loop/Shuffle)
```
Loop:    from-emerald-500 to-teal-600
Shuffle: from-cyan-500 to-blue-600
```

## Dark Mode (Future)

When implementing dark mode, use:
- Backgrounds: `dark:bg-slate-900`
- Cards: `dark:bg-slate-800`
- Text: `dark:text-slate-50`
- Borders: `dark:border-slate-700`
- Shadows: `dark:shadow-black/50`

## Component Examples

### Hero Section
```tsx
<div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 
                rounded-2xl p-8 sm:p-12 text-white shadow-2xl">
  <h2 className="text-4xl sm:text-5xl font-bold">Title</h2>
  <button className="px-8 py-4 rounded-full bg-white text-emerald-600 
                     font-bold hover:scale-110">
    Action
  </button>
</div>
```

### Card
```tsx
<div className="rounded-xl overflow-hidden bg-white shadow-md 
                hover:shadow-xl transition-all duration-400 
                hover:scale-105 hover:-translate-y-1">
  <img className="w-full h-full object-cover group-hover:scale-110 
                  transition-transform duration-700" />
  <div className="p-4">
    <h3 className="font-bold text-slate-900">Title</h3>
  </div>
</div>
```

### Button
```tsx
<button className="px-6 py-3 rounded-lg 
                   bg-emerald-600 hover:bg-emerald-700 
                   text-white font-bold
                   hover:scale-110 active:scale-95
                   shadow-md hover:shadow-lg
                   transition-all duration-300">
  Click Me
</button>
```

## Performance Notes

- Use CSS transforms (scale, translate) instead of width/height changes
- Leverage `will-change: transform` sparingly on hover animations
- Keep shadow changes subtle to maintain 60fps
- Use `transition-all` with specific durations
- Debounce resize listeners on responsive elements
