# �️ Delhi Heritage & Culture Portal

**Status:** ✅ **Production Ready**

A full-stack platform showcasing Delhi's rich cultural heritage, including sites, festivals, art & crafts, cuisine, and languages. Built with FastAPI backend and React frontend.

---

## 🎯 Project Overview

The Delhi Heritage & Culture Portal is a comprehensive platform dedicated to exploring and promoting Delhi's cultural treasures. Users can discover heritage sites, learn about festivals, explore traditional art & crafts, discover regional cuisine, and connect with indigenous languages.

**Key Features:**
- 📍 **Interactive Heritage Sites Map** - Explore 50+ heritage locations
- 🎭 **Cultural Collections** - Festivals, Art & Crafts, Cuisine, Languages
- 👤 **User Auth System** - Login with preferences and interests
- 🎟️ **Booking & Payments** - Reserve tickets and process payments
- 🔍 **Smart Recommendations** - AI-powered place suggestions based on interests
- 🌙 **Dark Mode** - Eye-friendly interface option
- 🌐 **Bilingual** - English and Hindi support
- 📱 **Fully Responsive** - Mobile, tablet, and desktop compatible
- ⚡ **PWA Support** - Progressive Web App capabilities

---

## 🛠️ Tech Stack

### Frontend
```
React 18.2          - UI Framework
Vite 5.0            - Build tool & dev server
React Router 6      - Client-side routing
Leaflet 1.9 + React Leaflet - Interactive maps
TailwindCSS 3.3     - Utility-first CSS
Framer Motion       - Animations & transitions
React Hook Form     - Form validation
i18next             - Internationalization (EN/HI)
Zustand             - Global state management
React Helmet        - Document head management
```

### Backend
```
FastAPI             - Python web framework
Uvicorn             - ASGI server
Python 3.x          - Runtime
JSON                - Data persistence
```

---

## 📁 Project Structure

```
INNOVIT-HACKATHON/
│
├── 📄 README.md                     (This file)
├── 📄 user.json                     (User data)
│
├── 📁 FRONTEND/                     (React + Vite Application)
│   ├── 📄 package.json              (Dependencies & scripts)
│   ├── 📄 vite.config.js            (Build configuration)
│   ├── 📄 tailwind.config.cjs       (TailwindCSS config)
│   ├── 📄 postcss.config.cjs        (PostCSS config)
│   │
│   ├── 📁 public/                   (Static assets)
│   │   ├── 📄 index.html
│   │   ├── 📄 manifest.json         (PWA manifest)
│   │   ├── 📄 sw.js                 (Service Worker)
│   │   └── 📁 assets/               (Images, icons, etc.)
│   │
│   └── 📁 src/                      (Source code)
│       ├── 📄 main.jsx              (Entry point)
│       ├── 📄 App.jsx               (Root component)
│       ├── 📄 i18n.js               (i18n configuration)
│       ├── 📄 registerServiceWorker.js
│       │
│       ├── 📁 components/           (Reusable components)
│       │   ├── 📄 Navbar.jsx
│       │   ├── 📄 Footer.jsx
│       │   ├── 📄 DarkModeToggle.jsx
│       │
│       ├── 📁 shared/               (Shared UI components)
│       │   ├── 📄 Carousel.jsx
│       │   └── 📄 Modal.jsx
│       │
│       ├── 📁 pages/                (Page components - lazy loaded)
│       │   ├── 📄 Home.jsx          (Landing page)
│       │   ├── 📄 Heritage.jsx      (Interactive map of heritage sites)
│       │   ├── 📄 Festivals.jsx     (Cultural festivals)
│       │   ├── 📄 ArtCrafts.jsx     (Traditional art & crafts)
│       │   ├── 📄 Cuisine.jsx       (Regional cuisine)
│       │   ├── 📄 Languages.jsx     (Indigenous languages)
│       │   ├── 📄 About.jsx         (About Delhi & culture)
│       │   ├── 📄 Contact.jsx       (Contact form)
│       │   ├── 📄 Explore.jsx       (Exploration/discovery)
│       │   ├── 📄 Login.jsx         (User authentication)
│       │   └── 📄 NotFound.jsx      (404 page)
│       │
│       ├── 📁 store/                (State management)
│       │   └── 📄 useStore.js       (Zustand store)
│       │
│       ├── 📁 data/                 (Data files)
│       │   └── 📄 heritage.json     (Heritage sites data)
│       │
│       ├── 📁 assests/              (Local assets)
│       │
│       └── 📁 styles/               (Global styles)
│           └── 📄 main.css          (TailwindCSS + custom styles)
│
├── 📁 backend/                      (FastAPI Backend)
│   ├── 📄 main.py                   (FastAPI app & routes)
│   ├── 📄 data.py                   (Heritage data store)
│   ├── 📄 delhi_places.py           (Delhi heritage sites)
│   ├── 📄 user.py                   (User management)
│   ├── 📄 bookings.py               (Ticket booking system)
│   ├── 📄 payments.py               (Payment processing)
│   ├── 📄 recommend.py              (Recommendation engine)
│   ├── 📄 requirements.txt          (Python dependencies)
│   ├── 📄 Procfile                  (Deployment configuration)
│   ├── 📄 user.json                 (User data)
│   ├── 📄 bookings.json             (Booking records)
│   └── 📄 payments.json             (Payment records)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and **npm**
- **Python** 3.8+ and **pip**
- **Git** (optional)

### Frontend Setup (30 seconds)
```bash
cd FRONTEND
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Backend Setup (30 seconds)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend API will be available at `http://localhost:8000`

---

## 🔌 Backend API Endpoints

### Heritage Sites
```
GET  /                      - Health check
GET  /places                - Get all heritage places
GET  /places/{place_key}    - Get specific place details
```

### User Management
```
POST /login                 - Create/authenticate user
  Body: {
    "name": "string",
    "user_type": "indian|foreigner|student",
    "interests": ["array", "of", "interests"]
  }
```

### Recommendations
```
POST /recommend             - Get recommended places
  Body: {
    "user_id": "string",
    "time": 6  // hours available
  }
```

### Bookings
```
POST /bookings              - Create a booking
GET  /bookings/{booking_id} - Get booking details
GET  /user/{user_id}/bookings - Get user bookings
```

### Payments
```
POST /payments              - Process payment
GET  /payments/{payment_id} - Get payment details
```

---

## 🎨 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with featured sites |
| Heritage | `/heritage` | Interactive Leaflet map with 50+ heritage sites |
| Festivals | `/festivals` | Delhi's cultural festivals |
| Art & Crafts | `/artcrafts` | Traditional art forms and crafts |
| Cuisine | `/cuisine` | Regional cuisine and specialties |
| Languages | `/languages` | Indigenous languages spoken in Delhi |
| About | `/about` | Information about Delhi's culture |
| Contact | `/contact` | Contact form |
| Explore | `/explore` | Discovery/exploration section |
| Login | `/login` | User authentication |
| 404 | `*` | Not found page |

---

## 📦 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend
```bash
uvicorn main:app --reload              # Run with auto-reload
uvicorn main:app --host 0.0.0.0        # Run on all interfaces
```

---

## 🌐 Features

### Interactive Map
- **Technology**: React Leaflet + Leaflet.js
- **Functionality**: Click markers to view place details, search locations
- **Data**: 50+ heritage sites in Delhi with coordinates

### Smart Recommendations
- **Personalization**: Based on user interests and available time
- **Algorithm**: Matches user preferences with site categories and visiting duration
- **API**: `/recommend` endpoint for intelligent suggestions

### Booking System
- **Ticket Types**: Indian (₹100), Foreigner ($5), Student (₹50)
- **Data Storage**: JSON file persistence
- **Status Tracking**: Confirmed bookings with unique IDs

### Payment Processing
- **Methods**: Card, UPI
- **Simulation**: Marks payments as completed
- **Integration**: Links payments to bookings

### User Authentication
- **Types**: Indian, Foreigner, Student
- **Interests**: Custom interest tags for personalization
- **Storage**: localStorage + JSON persistence

### Internationalization (i18n)
- **Languages**: English and Hindi
- **Management**: i18next library
- **Toggle**: Language switcher in Navbar

### Dark Mode
- **UI**: TailwindCSS dark mode classes
- **Persistence**: Saved in localStorage
- **Toggle**: DarkModeToggle component

---

## 🔐 CORS Configuration

Backend allows requests from:
- `http://localhost:5173` (local frontend)
- `https://heritage-and-cultue-portal.vercel.app` (production frontend)

---

## 📋 Data Files

### heritage.json
Contains heritage site data including:
- Site name, key, category
- Latitude/longitude coordinates
- Description, opening hours
- Entry fees by visitor type

### delhi_places.py
Python list of 50+ heritage sites ready for database insertion

### user.json
Stores user profiles with preferences

### bookings.json
Records of all ticket bookings

### payments.json
Records of all payment transactions

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect Vercel to repository
3. Deploy (auto-deployed on push)

### Backend (Render/Railway/Heroku)
1. Use `Procfile` for deployment configuration
2. Ensure Python and pip are installed
3. Set environment variables if needed

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

### Development Workflow
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 Documentation

Additional documentation files are available in the FRONTEND folder:
- `QUICK_START.md` - Quick setup guide
- `SETUP_GUIDE.md` - Detailed setup instructions
- `INSTALLATION.md` - Installation steps
- `FILE_STRUCTURE.md` - Detailed file structure reference
- `EXAMPLES.md` - Code examples and patterns
- `COMPONENTS.md` - Component documentation
- `INDEX.md` - Documentation index

---

## 🌍 Live Deployment

- **Frontend**: [Heritage Portal](https://heritage-and-cultue-portal.vercel.app)
- **Backend API**: [Delhi Heritage Backend](https://delhi-heritage-api.onrender.com)

---

## 📧 Support & Contact

For questions, issues, or contributions, please check the Contact page or open an issue on GitHub.

---

## 📄 License

This project is part of the INNOVIT Hackathon.

---

**Happy exploring Delhi's rich heritage! 🏛️**
