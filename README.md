# TaskBoard Kanban

A polished drag-and-drop Kanban board built with React 18 via CDN — no build step, no npm required. Features a pink/rose dark theme with smooth animations.

## Features

- **3-Column Kanban Layout** — To Do, In Progress, Done with colored gradient headers
- **Drag & Drop** — Move cards between columns using native HTML5 drag-and-drop API
- **Add Cards** — Create new cards with title and optional description in any column
- **Delete Cards** — Remove cards with a single click
- **Card Detail Modal** — Click the magnifier icon to view full card details in a modal overlay
- **localStorage Persistence** — All board data is saved automatically and survives page reloads
- **Responsive Design** — Columns stack vertically on smaller screens
- **Smooth Animations** — Hover effects, drag states, and modal transitions

## Tech Stack

- **React 18** — Loaded via CDN (unpkg), using hooks (useState, useEffect, useRef)
- **ReactDOM 18** — createRoot API for concurrent rendering
- **Babel Standalone** — In-browser JSX transformation
- **CSS3** — Custom properties, gradients, flexbox, animations, and transitions
- **localStorage API** — Client-side data persistence
- **HTML5 Drag and Drop API** — Native browser drag-and-drop

## Getting Started

No installation needed. Simply open `index.html` in any modern browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a simple HTTP server (recommended for CORS)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Project Structure

```
taskboard/
├── index.html   # Main HTML file with embedded CSS and CDN script tags
├── app.jsx      # React application source (transformed by Babel in-browser)
└── README.md    # This file
```

## Color Scheme

The app uses a pink/rose palette on a dark background:
- Background: Deep purple-black (#1a1020)
- Cards: Dark plum (#2e1a38)
- Accents: Rose/pink gradients (#ec4899, #f472b6, #fb7185)
- Column headers: Red-rose to magenta gradients

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.
