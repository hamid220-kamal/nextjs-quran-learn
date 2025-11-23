# 🎯 Radio UI - Quick Reference Card

## Files Modified

```
✅ src/app/radio/page.tsx
✅ src/app/radio/components/StationCard.tsx
✅ src/app/radio/components/StationFeaturedCard.tsx
✅ src/app/radio/components/FullPlayer.tsx
✅ src/app/radio/components/MiniPlayer.tsx
✅ .github/copilot-instructions.md
```

## Documentation Files Created

```
📖 RADIO_UI_IMPROVEMENTS.md
📖 RADIO_DESIGN_SYSTEM.md
📖 RADIO_REDESIGN_SUMMARY.md
📖 RADIO_VISUAL_REFERENCE.md
📖 RADIO_QA_CHECKLIST.md
📖 RADIO_UI_COMPLETE.md
```

---

## Color Palette

| Use | Color | Hex |
|-----|-------|-----|
| Primary | Emerald 600 | #059669 |
| Primary Light | Emerald 500 | #10B981 |
| Secondary | Teal 600 | #14B8A6 |
| Text Primary | Slate 900 | #0F172A |
| Text Secondary | Slate 600 | #475569 |
| Background | White | #FFFFFF |

---

## Typography

| Element | Class | Size |
|---------|-------|------|
| Hero Title | text-4xl sm:text-5xl | 36-48px |
| Section Title | text-2xl | 24px |
| Card Title | text-base font-bold | 16px |
| Subtitle | text-sm font-medium | 14px |
| Body | text-sm | 14px |
| Small | text-xs | 12px |

---

## Common Classes

```tsx
// Cards
rounded-xl shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1

// Buttons
px-8 py-4 rounded-full hover:scale-110 active:scale-95 transition-all

// Text
text-slate-900 font-bold line-clamp-2 leading-tight

// Hover Effects
transition-all duration-300 hover:opacity-80 hover:scale-105
```

---

## Button Variants

### Primary
```tsx
bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110
```

### Secondary
```tsx
bg-slate-200 text-slate-900 hover:bg-slate-300
```

### Icon
```tsx
p-2.5 rounded-full hover:bg-emerald-100 text-emerald-600
```

---

## Responsive Breakpoints

```tsx
// Mobile (default)
className="text-sm p-4"

// Tablet+
className="sm:text-base sm:p-6"

// Desktop+
className="md:text-lg md:p-8"

// Large+
className="lg:grid-cols-3"
```

---

## Animation Timings

| Speed | Duration | Use |
|-------|----------|-----|
| Fast | 200ms | Button clicks |
| Standard | 300ms | Transitions |
| Slow | 400ms | Hover effects |
| Slow+ | 500ms | Entrances |
| Very Slow | 700ms | Image zoom |

---

## Shadow System

```css
shadow-md    /* Cards */
shadow-lg    /* Hover state */
shadow-xl    /* Featured */
shadow-2xl   /* Buttons, hero */
```

---

## Spacing Guide

```
p-4          /* Card padding */
p-8 sm:p-12  /* Section padding */
gap-4        /* Card gaps */
gap-8        /* Section gaps */
space-y-10   /* Vertical spacing */
```

---

## Component Props

### StationCard
```tsx
<StationCard
  title="Station Name"
  subtitle="Reciter Name"
  tags={["Popular", "Friday"]}
  imageUrl="/image.jpg"
  stationId="station-id"
/>
```

### FullPlayer
```tsx
// Uses PlayerContext - no props
<FullPlayer />
```

### MiniPlayer
```tsx
// Uses PlayerContext - no props
<MiniPlayer />
```

---

## Quick Improvements

| Element | Before | After |
|---------|--------|-------|
| Cards | `rounded-2xl` | `rounded-xl` |
| Hover | `scale-105` | `scale-105 -translate-y-1` |
| Shadow | Basic | Progressive depth |
| Hero | Simple | Gradient + animation |
| Mini Player | Fixed sizes | Responsive `sm:` |

---

## Performance Tips

✅ Use CSS transforms (scale, translate)  
✅ Avoid width/height changes  
✅ Lazy load images  
✅ Use will-change sparingly  
✅ Keep animations < 500ms  

---

## Accessibility

✅ 7:1 text contrast on white  
✅ 4.5:1 on colored backgrounds  
✅ Focus rings: outline-2 offset-2  
✅ Touch targets: ≥ 44px  
✅ Proper aria-labels  

---

## When Adding New Components

1. Use `rounded-xl` for cards
2. Apply `shadow-md hover:shadow-xl`
3. Add hover: `hover:scale-105 hover:-translate-y-1`
4. Duration: `transition-all duration-300`
5. Colors: emerald/teal palette
6. Spacing: 8px grid (gap-4, p-4, etc)

---

## Testing Checklist

- [ ] Mobile responsive (< 640px)
- [ ] Tablet layout (640-1024px)
- [ ] Desktop layout (1024px+)
- [ ] Hover effects smooth
- [ ] Animations at 60fps
- [ ] Keyboard navigation works
- [ ] Focus rings visible
- [ ] Images load/fallback
- [ ] Audio controls work
- [ ] No console errors

---

## Common Issues & Fixes

### Cards not scaling
```tsx
// Add transform to parent
transform transition-all duration-300
```

### Progress bar not visible
```tsx
// Use z-index
z-40 fixed bottom-0 left-0 right-0
```

### Mobile text overflow
```tsx
// Add line-clamp
line-clamp-2 text-sm sm:text-base
```

### Animations jerky
```tsx
// Use CSS transforms only
transform scale-110 transition-transform
```

---

## Resources

- Design System: `RADIO_DESIGN_SYSTEM.md`
- Visual Guide: `RADIO_VISUAL_REFERENCE.md`
- Testing: `RADIO_QA_CHECKLIST.md`
- Full Docs: `RADIO_UI_IMPROVEMENTS.md`
- Copilot: `.github/copilot-instructions.md`

---

## Key Files Location

```
📁 src/app/radio/
  📄 page.tsx
  📁 components/
    📄 StationCard.tsx
    📄 StationFeaturedCard.tsx
    📄 FullPlayer.tsx
    📄 MiniPlayer.tsx
    📄 player-animations.css
  📁 hooks/
    📄 useAudioPlayer.ts
  📁 state/
    📄 PlayerState.tsx
```

---

## One-Page Cheat Sheet

**Colors**: Emerald (#10B981) + Teal (#14B8A6)  
**Spacing**: 8px grid (gap-4, p-4)  
**Cards**: `rounded-xl shadow-md hover:shadow-xl`  
**Hover**: `scale-105 -translate-y-1 duration-300`  
**Responsive**: Use `sm:`, `md:`, `lg:` prefixes  
**Focus**: `outline-2 outline-offset-2 outline-emerald-500`  
**Touch**: Keep targets ≥ 44px  
**Animations**: 300-700ms, CSS transforms  

---

**Version**: 1.0  
**Last Updated**: 2025-11-23  
**Status**: ✅ Production Ready
