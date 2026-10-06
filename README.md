<div align="center">

# ✳ Good Things

### A calmer corner of the internet.

Thoughtful reads, fresh perspectives, and things worth your time — gathered in one personal, beautifully considered space. Includes **120 curated mock stories** and **2 community posts** to explore without API keys.

<br />

![React](https://img.shields.io/badge/React-18-20232a?logo=react&logoColor=61DAFB&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Redux_Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white&style=flat-square)

</div>

---

## A little of what you love

**Good Things** is a responsive, personalized content dashboard built around a simple idea: the internet can feel a little more intentional. Browse a thoughtfully curated feed of articles, podcasts, videos, and community posts; follow the topics that interest you; and save good things for later.

### ✦ Made for your kind of curious

| Your day, your way | Little details that help |
| --- | --- |
| **A personal feed** with editorial picks and a mix of reading, listening, watching, and community content. | **Debounced search** across titles, topics, descriptions, sources, and authors. |
| **Your interests** shape the topics you see. | **Drag and drop** cards to rearrange your feed. |
| **Trending** brings popular stories into view. | **Saved for later** keeps your favorite finds close. |
| **Evening reading** offers a softer dark theme. | **Responsive layout**, keyboard-friendly controls, and reduced-motion support. |

> Your interests, saved stories, and theme preference are kept in your browser. Your personal corner stays personal.

## Take a look around

The dashboard includes a sidebar for your feed, trending stories, saved items, and interests; a featured story to start the day; and a companion rail for the daily pulse and a listening recommendation.

<details>
<summary><strong>What you can do</strong></summary>

- Search quickly with **Ctrl + K** on Windows/Linux or **⌘ + K** on macOS.
- Filter the feed by Design, Technology, Culture, Science, Wellness, or Business.
- Save and unsave stories from a card or its story preview.
- Adjust your interests and turn evening reading on or off in **Preferences**.
- Select **Show me a little more** to reveal another 12 items.
- Reorder cards by dragging them into place.
- Open **Trending** or **Saved for later** from the sidebar.
- Browse the complete mock library across all six topics.

</details>

## Step-by-step walkthrough

The [Hindi-captioned walkthrough](./good-things-walkthrough-hi.mp4) demonstrates how to explore the feed, search, filter by topic, save stories, view trending content, and load more items. The video is captioned (no voice-over); the editable [Hindi subtitle file](./good-things-walkthrough-hi.srt) is included too.

## Get started

You’ll need [Node.js](https://nodejs.org/) and npm installed.

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open the local URL printed by Vite to see your dashboard.

### Handy commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Under the hood

- **React 18** and **Vite** power the app and its development workflow.
- **Tailwind CSS** provides the utility-first styling setup, alongside a small custom design system.
- **Redux Toolkit** manages preferences and favorites.
- **Framer Motion** adds subtle transitions and animated cards.
- **Lucide React** supplies the interface icons.

### Project map

```text
.
├── index.html             # App entry point and page metadata
├── src/
│   ├── App.jsx            # Dashboard, feed, and interactive views
│   ├── content.js         # Seed stories and the 120-item mock catalog
│   ├── index.css          # Tailwind layers and responsive design system
│   ├── main.jsx           # React and Redux entry point
│   └── store.js           # Redux state and browser persistence
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Content and privacy

The dashboard includes **120 locally generated mock stories** (20 per topic), 8 hand-picked seed stories, and 2 sample community posts. These items are deterministic demo data—not live reporting or third-party API results. No API keys or content services are needed to browse the mock library. To connect real providers, replace or extend `src/content.js` and connect the resulting data to the feed.

Favorites, selected topics, and dark mode are saved in your browser’s `localStorage` under `the-current-preferences`. The demo does not include an account system, backend, or real-time feed.

## Make it yours

1. Update the seed items or mock catalog in `src/content.js`.
2. Adjust colors, typography, and responsive styles in `src/index.css` and `tailwind.config.js`.
3. Connect your content providers when you’re ready; keep private API credentials on a server rather than in client-side code.

---

<div align="center">

*Made with a little more intention.*  
**Find your current.**

</div>
