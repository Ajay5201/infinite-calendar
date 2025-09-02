# My Hair Diary - Infinite Calendar

A React-based infinite scrolling calendar application for tracking hair care journal entries.

## Running Locally

Getting this up and running is pretty straightforward:

1. **Clone the repo** (or however you got the code)
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the dev server:**
   ```bash
   npm start
   # or
   yarn start
   ```
4. **Open your browser** to `http://localhost:3000`

That's it! The app should load with the current month visible by default.

## Design Choices & Assumptions

### Why Infinite Scroll?
I went with infinite scrolling instead of traditional month navigation because it feels more natural for browsing through time. You can just scroll up to see past months or down for future ones without clicking through month by month.

### Performance Considerations
- **Lazy Loading**: Only renders months as they come into view (well, with a small buffer)
- **Ref-based State**: Used `useRef` for month range tracking to avoid stale closure issues that were causing weird jumps
- **Throttled Scroll**: Wrapped scroll handling in `requestAnimationFrame` to keep things smooth

### State Management
The trickiest part was managing the relationship between:
- Which months are currently rendered
- Which month is "active" (most visible)
- The scroll position

I ended up using a combination of state and refs to avoid re-render cycles that were messing with scroll positioning.

### UI/UX Decisions
- **Fixed Header**: Keeps the month/year indicator and navigation always visible
- **Smooth Scrolling**: When you click the nav arrows, it smoothly scrolls instead of jarring jumps
- **Visual Feedback**: The current month is highlighted differently so you always know where you are

### Technical Assumptions
- **Material-UI**: Assumes you're using MUI for components and theming
- **Journal Data Structure**: Expects journal entries to have a `date` field that can be parsed
- **Date Utilities**: Relies on custom date parsing/formatting utils (probably in `../utils/dateUtils`)


## File Structure
```
components/
├── InfiniteCalendar.tsx    # Main component (this file)
├── CalendarMonth.tsx       # Individual month view
└── journal-card.tsx        # Modal for viewing entries

data/
└── journalEntries.js       # Your journal data

utils/
└── dateUtils.js           # Date parsing/formatting helpers
```

## Future Improvements
- Add event search or filtering.
- Might be nice to have keyboard shortcuts for month navigation
- Could cache rendered months to improve scroll performance