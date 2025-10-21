# Enhanced Quran Navigation Components

## Overview
This directory contains a set of components that provide comprehensive navigation interfaces for browsing the Quran using various organizational structures. The main components are:

1. **TabQuranNavigator**: A tabbed interface for exploring the Quran through different navigation methods
2. **NavCardSelector**: A component for switching between view modes
3. **Detail Panels**: Interactive panels that display detailed information when hovering over items

## TabQuranNavigator Features

### Multiple Navigation Structures
- **Surah Navigation**: Browse all 114 surahs with Arabic names, English translations, and metadata
- **Juz Navigation**: Browse all 30 sections of the Quran
- **Manzil Navigation**: Browse all 7 manzil sections of the Quran
- **Hizb Navigation**: Browse all 60 hizb sections of the Quran
- **Page Navigation**: Browse all 604 pages of the Quran using a grid layout
- **Ruku Information**: View information about the 556 ruku sections in the Quran

### Interactive Features
- **Detail Panels**: Hover over items to see additional information and context
- **Smooth Animations**: Pleasant transition effects for all interactions
- **Responsive Layout**: Works seamlessly on all device sizes

### UI Features
- Modern tabbed interface
- Responsive design for all screen sizes
- Efficient data loading (only loads data for the active tab)
- Interactive UI elements with hover effects
- Loading states with spinner animation
- Error handling with retry functionality

## Integration with QuranClient
The TabQuranNavigator is integrated with the QuranClient component through:

1. The `NavCardSelector` component for switching between card view and tabbed navigation view
2. Navigation handlers that direct users to the appropriate content

## Component Props

```typescript
interface TabQuranNavigatorProps {
  onSelectSurah: (surahNumber: number) => void;
  onSelectJuz: (juzNumber: number) => void;
  onSelectManzil: (manzilNumber: number) => void;
  onSelectHizb: (hizbNumber: number) => void;
  onSelectPage: (pageNumber: number) => void;
  className?: string;
}
```

## API Integration

The component integrates with the `quranApi.ts` utility functions to fetch data from the AlQuran.cloud API:
- `fetchSurahs()` - For surah navigation
- `fetchAllJuz()` - For juz navigation 
- `fetchAllManzil()` - For manzil navigation
- `fetchAllHizb()` - For hizb navigation

Page numbers are generated client-side (1-604) without requiring API calls.

## Usage Example

```tsx
<TabQuranNavigator 
  onSelectSurah={(number) => console.log(`Selected Surah ${number}`)}
  onSelectJuz={(number) => console.log(`Selected Juz ${number}`)}
  onSelectManzil={(number) => console.log(`Selected Manzil ${number}`)}
  onSelectHizb={(number) => console.log(`Selected Hizb ${number}`)}
  onSelectPage={(number) => console.log(`Selected Page ${number}`)}
/>
```

## Styling

The component uses a set of modular CSS styles defined in `TabQuranNavigator.css`. The styles feature:
- CSS variables for consistent theming
- Flexbox and Grid layouts for responsive design
- Smooth animations and transitions
- Accessible contrast and hover states

## NavCardSelector Component
This component provides a user-friendly way to switch between different view modes (card view and tabbed navigation view). It features:
- Modern card-based UI
- Hover effects and transitions
- Clear visual indication of the active mode
- Customizable icons and labels

## Integration Between Components
The components are designed to work together seamlessly:

1. **QuranClient** acts as the container component
2. **NavCardSelector** allows users to switch between view modes
3. **TabQuranNavigator** provides detailed navigation when in tabbed mode
4. **SurahCard** displays individual surahs when in card mode

## Future Enhancements

1. Add detailed metadata for juz, manzil, and hizb when API data is available
2. Implement quick-jump navigation for pages
3. Add sorting and additional filtering options
4. Add translation options for Arabic text
5. Add bookmark functionality for frequently accessed sections
6. Add animation transitions between view modes
7. Implement audio preview functionality
8. Add comparison view for multiple translations