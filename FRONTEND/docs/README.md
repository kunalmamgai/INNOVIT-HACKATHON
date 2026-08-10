# Heritage & Culture Portal — Frontend

> React 18 + Vite 5 + TailwindCSS 3 single-page application for the Heritage & Culture Portal.
> This document is the single source of frontend documentation. For architecture, backend API reference and deployment overview, see the [root README](../../README.md).

---

## 📦 Tech Stack

- **Core:** React 18, Vite 5, React Router 6
- **Styling:** TailwindCSS 3, Framer Motion
- **Geospatial & State:** React Leaflet, Leaflet, Zustand, i18next
- **PWA:** Service worker + manifest (`public/sw.js`, `public/manifest.json`)

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ & npm

### Install & run
```bash
cd FRONTEND
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
Open `http://127.0.0.1:5173`.

> The frontend expects the FastAPI backend on `http://127.0.0.1:8000` in development (see `src/config/api.js`).

### npm scripts
| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload (port 5173) |
| `npm run build` | Create optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally (port 4173) |
| `npm run lint` | Check code quality with ESLint |
| `npm run format` | Auto-format code with Prettier |

---

## 🔧 Environment & Configuration

Create a `.env.local` file in `FRONTEND/` (it is git-ignored):

```
# Optional — overrides the backend base URL
VITE_API_URL=http://127.0.0.1:8000
```

API resolution logic in `src/config/api.js`:

1. `VITE_API_URL` if set (development or production)
2. In dev, defaults to `http://<host>:8000` (same host as the frontend)
3. Otherwise falls back to the production backend: `https://delhi-heritage-api.onrender.com`

`apiFetch(path, options)` is a thin wrapper that attaches `Authorization: Bearer <token>`
from `localStorage` and redirects to `/login` on a `401`.

---

## 📁 Project Structure

```text
FRONTEND/
├── public/                  # Static assets served as-is
│   ├── aframe-viewer.html   # Immersive A-Frame VR viewer (used by VirtualTour)
│   ├── sw.js                # Service worker (PWA)
│   ├── manifest.json        # PWA manifest
│   └── assets/              # Icons, logos, marker images, placeholder media
├── src/
│   ├── main.jsx             # React entry — router + Helmet provider + PWA init
│   ├── App.jsx              # Route table (lazy-loaded pages) + auth/session state
│   ├── i18n.js              # English / Hindi translation strings
│   ├── registerServiceWorker.js
│   ├── components/          # App-wide components
│   │   ├── Navbar.jsx       # Navigation + dark-mode toggle
│   │   ├── Footer.jsx
│   │   ├── ChatBot.jsx      # AI heritage guide (Gemini) + voice input/TTS
│   │   └── DarkModeToggle.jsx
│   ├── pages/               # Route-level pages (code-split via React.lazy)
│   │   ├── Home.jsx, Heritage.jsx, Explore.jsx, Festivals.jsx
│   │   ├── ArtCrafts.jsx, VirtualTour.jsx, AR-Chaelogist.jsx
│   │   ├── Headset.jsx, TourismEventCoPublishing.jsx
│   │   ├── About.jsx, Contact.jsx, Login.jsx, NotFound.jsx
│   ├── shared/              # Reusable UI primitives
│   │   ├── Carousel.jsx
│   │   └── Modal.jsx
│   ├── store/useStore.js    # Zustand store (dark mode, preferences)
│   ├── config/api.js        # API base URL + authenticated fetch helper
│   ├── styles/main.css      # Tailwind directives + custom theme
│   └── utils/pdfExport.js   # Client-side PDF generation (jspdf)
├── vercel.json              # Vercel SPA rewrite config
├── tailwind.config.cjs
├── vite.config.js           # Build config + dev proxies + vendor chunking
└── package.json
```

> Places data is **not** duplicated in the frontend — `Heritage`, `Explore`, and `VirtualTour`
> all fetch the authoritative catalog from the backend `GET /places` endpoint.

---

## 🗺️ Routes

| Route | Page | Description |
|---|---|---|
| `/` | `Home` | Hero, featured heritage highlights, stats |
| `/login` | `Login` | Authentication & signup |
| `/heritage` | `Heritage` | Interactive Leaflet monument map |
| `/explore` | `Explore` | Discovery engine — recommendations, booking, payment, PDF export |
| `/festivals` | `Festivals` | Cultural festivals calendar |
| `/arts` | `ArtCrafts` | Arts, crafts & artisan stories |
| `/virtual-tour` | `VirtualTour` | Immersive A-Frame panorama viewer |
| `/ar-vr-tour` | `AR-Chaelogist` | AR/VR experience explainer |
| `/headset` | `Headset` | VR headset recommendations |
| `/tourism-event-co-publishing` | `TourismEventCoPublishing` | Partner/event co-publishing |
| `/about`, `/contact` | `About` / `Contact` | Portal info & support |
| `*` | `NotFound` | 404 page |

All page components are lazy-loaded (`React.lazy` + `Suspense`) so heavy libraries
(Leaflet, Framer Motion) are only fetched when their route is visited.

---

## 🔌 Backend Integration

| Endpoint | Used by |
|---|---|
| `GET /places` | Heritage, Explore, VirtualTour |
| `POST /chat` | ChatBot (AI guide) |
| `POST /login`, `POST /signup` | Login |
| `POST /recommend` | Explore (personalized itineraries) |
| `POST /bookings`, `GET /bookings` | Explore (ticketing) |
| `POST /payments` | Explore (payment) |
| `GET /proxy-image?url=...` | VirtualTour (CORS-safe image loading) |
| `GET /discussions`, `POST /like`, `GET/POST/DELETE /comments` | Community features |
| `GET/POST /gov/reports`, `GET /gov/metrics` | Citizen reporting dashboard |

---

## 🚀 Deployment

### Vercel (configured)
`vercel.json` rewrites all routes to `index.html` for SPA support. The repo deploys
the `FRONTEND/` directory as its own project:

```bash
npm run build
vercel --prod
```

### Netlify (alternative)
```bash
npm run build
netlify deploy --prod --dir=dist
```

> Set `VITE_API_URL` to the production backend URL in your hosting provider's
> environment variables.

---

## 🧪 Common Issues

| Symptom | Fix |
|---|---|
| Port 5173 already in use | `npm run dev -- --port 5174` (CORS for 5174 is enabled server-side) |
| Places not loading | Backend not running — start `uvicorn main:app --port 8000` |
| Chat returns errors | Ensure `GEMINI_API_KEY` is set in `backend/.env` |
| `401` redirect loop | Clear `localStorage` (`access_token`, `currentUser`) |

---

## ✅ Delivery Checklist

- [ ] `npm install` completes cleanly
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm run dev` — all routes render, map loads, chat responds
- [ ] Dark mode persists across reloads (Zustand + localStorage)
- [ ] Booking → payment → PDF ticket export works end-to-end
