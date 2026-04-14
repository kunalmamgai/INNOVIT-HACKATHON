# Heritage & Culture Portal

Full-stack heritage discovery platform with a React + Vite frontend and a FastAPI backend.

---

## Project Overview

This project helps users explore heritage places, view map-based monument details, start virtual tours, chat with an AI guide, and create bookings/payments.

### Current Feature Set
- Interactive heritage map with monument details
- Explore page with booking and payment flow
- Virtual tour experience with image proxy support
- AI chatbot for heritage/culture Q&A
- Community endpoints for discussions, likes, and comments
- Dark mode preference persistence
- PWA assets and service-worker setup in frontend public folder

---

## Tech Stack

### Frontend
- React 18
- Vite 5
- React Router 6
- TailwindCSS 3
- React Leaflet + Leaflet
- Framer Motion
- Zustand
- i18next

### Backend
- FastAPI
- Uvicorn
- Python 3.11+
- Motor + PyMongo (MongoDB)
- python-dotenv
- google-genai (Gemini API integration)

---

## Workspace Structure

```text
INNOVIT-HACKATHON/
├── backend/
│   ├── main.py
│   ├── mongo.py
│   ├── chatbot.py
│   ├── recommend.py
│   ├── user.py
│   ├── bookings.py
│   ├── payments.py
│   ├── data.py
│   ├── delhi_places.py
│   ├── india_places.py
│   └── requirements.txt
├── FRONTEND/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── config/api.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── shared/
│   │   ├── store/
│   │   └── styles/
│   └── package.json
├── likes.json
├── comments.json
├── user.json
└── README.md
```

---

## Prerequisites

- Node.js 18+
- npm
- Python 3.11+
- pip

---

## Environment Variables

Create a `.env` file in `backend/` (or provide variables in your runtime environment):

```env
MONGO_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

---

## Local Development

### 1) Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend runs at: `http://127.0.0.1:8000`

### 2) Frontend

```bash
cd FRONTEND
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend runs at: `http://127.0.0.1:5173`

The frontend API base is handled in `FRONTEND/src/config/api.js` and points to local backend in dev mode.

---

## Frontend Routes (Current)

| Route | Page |
|---|---|
| `/` | Home |
| `/login` | Login / Signup UI |
| `/heritage` | Heritage map |
| `/festivals` | Festivals |
| `/arts` | Art & Crafts |
| `/explore` | Explore + booking/payment flow |
| `/virtual-tour` | Virtual tour |
| `/community` | Currently mapped to Virtual Tour |
| `/about` | About |
| `/contact` | Contact |
| `*` | NotFound |

---

## Backend API (Current)

### Core
- `GET /` - health message
- `GET /places` - list all places
- `GET /places/{place_key}` - single place details
- `GET /proxy-image?url=...` - image proxy for virtual tour / CORS handling

### User & Recommendations
- `POST /login`
- `POST /recommend`
- `POST /chat`

### Bookings & Payments
- `POST /bookings`
- `GET /bookings?user_id=...`
- `POST /payments`

### Community
- `GET /discussions`
- `POST /like`
- `GET /comments`
- `POST /comments`
- `DELETE /comments?comment_id=...`

---

## API Payload Examples

### POST /bookings
```json
{
  "user_id": "user-id",
  "place_key": "qutub_minar",
  "visit_date": "2026-03-01",
  "num_tickets": 2,
  "ticket_type": "indian"
}
```

### POST /payments
```json
{
  "booking_id": "booking-id",
  "user_id": "user-id",
  "amount": 500,
  "payment_method": "upi",
  "upi_id": "name@bank"
}
```

### POST /chat
```json
{
  "message": "Tell me about Humayun's Tomb",
  "conversation_history": []
}
```

---

## CORS (Backend)

Configured origins include:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5174`
- `https://ar-vr-explore.vercel.app`
- `http://127.0.0.1:8000`

---

## Frontend Scripts

From `FRONTEND/`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

---

## Deployment Notes

- Frontend: Vercel-ready (`FRONTEND/vercel.json`)
- Backend: compatible with Uvicorn platforms (Render/Railway/Heroku-style)
- Ensure `MONGO_URL` and `GEMINI_API_KEY` are configured in deployment environment

---

## Additional Frontend Docs

Inside `FRONTEND/`:
- `QUICK_START.md`
- `SETUP_GUIDE.md`
- `INSTALLATION.md`
- `FILE_STRUCTURE.md`
- `EXAMPLES.md`
- `COMPONENTS.md`
- `INDEX.md`

---

## License

Project created for the INNOVIT Hackathon.
