# Heritage & Culture Portal - Setup & Deployment Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone or Download
```bash
cd "c:\Users\Kunal\OneDrive\Desktop\Self\Hackathon"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project File Reference

### Core Application Files
| File | Purpose |
|------|---------|
| `src/main.jsx` | React entry point with router and providers |
| `src/App.jsx` | Main app shell with routing |
| `src/i18n.js` | i18next configuration (EN + HI) |
| `src/registerServiceWorker.js` | PWA service worker registration |
| `index.html` | HTML template with meta tags |

### Components
| Component | Location | Purpose |
|-----------|----------|---------|
| Navbar | `src/components/Navbar.jsx` | Header with nav, language selector, dark mode |
| Footer | `src/components/Footer.jsx` | Footer with copyright |
| DarkModeToggle | `src/components/DarkModeToggle.jsx` | Dark mode switcher |
| Carousel | `src/shared/Carousel.jsx` | Featured sites carousel |
| Modal | `src/shared/Modal.jsx` | Reusable modal dialog |

### Pages (8 Pages)
| Page | Route | File |
|------|-------|------|
| Home | `/` | `src/pages/Home.jsx` |
| Heritage Sites | `/heritage` | `src/pages/Heritage.jsx` |
| Festivals | `/festivals` | `src/pages/Festivals.jsx` |
| Art & Crafts | `/arts` | `src/pages/ArtCrafts.jsx` |
| Languages | `/languages` | `src/pages/Languages.jsx` |
| About | `/about` | `src/pages/About.jsx` |
| Contact | `/contact` | `src/pages/Contact.jsx` |
| Explore (VR/AR) | `/explore` | `src/pages/Explore.jsx` |
| 404 | `*` | `src/pages/NotFound.jsx` |

### Configuration Files
| File | Purpose |
|------|---------|
| `vite.config.js` | Vite build configuration |
| `tailwind.config.cjs` | Tailwind CSS theming |
| `postcss.config.cjs` | PostCSS with Tailwind & autoprefixer |
| `.eslintrc.cjs` | ESLint rules |
| `.prettierrc.json` | Prettier formatting |
| `package.json` | Dependencies and scripts |

### PWA & Public Assets
| File | Purpose |
|------|---------|
| `public/manifest.json` | Web app manifest for PWA |
| `public/sw.js` | Service worker for offline caching |
| `public/assets/` | Images, videos, icons |

---

## 🎨 Customization Guide

### Change Color Scheme
Edit `src/styles/main.css`:
```css
:root {
  --earth: #8B6F47;   /* Darker brown */
  --sand: #F5EFE1;    /* Lighter sand */
  --gold: #D4A574;    /* Warmer gold */
}
```

Also update `tailwind.config.cjs` colors object.

### Add More Heritage Sites
Edit `src/data/heritage.json`:
```json
{
  "id": 6,
  "name": "Borobudur Temple",
  "lat": 27.6093,
  "lng": 80.2855,
  "desc": "UNESCO World Heritage site in Agra region"
}
```

### Change Language Content
Edit `src/i18n.js` resources:
```javascript
hi: {
  translation: {
    home: 'मुख पृष्ठ',
    // Add more translations
  }
}
```

### Update Fonts
In `tailwind.config.cjs`:
```javascript
fontFamily: {
  poppins: ['Poppins', 'sans-serif'],
  noto: ['Noto Sans Devanagari', 'sans-serif'],
  // Add your fonts here
}
```

---

## 🧪 Development Workflow

### Watch & Dev
```bash
npm run dev
```
Page hot-reloads on file changes.

### Code Quality
```bash
npm run lint     # Check code
npm run format   # Auto-fix formatting
```

### Build for Production
```bash
npm run build
```
Creates optimized `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

---

## 📦 Dependencies Explained

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-router-dom | ^6.14.0 | Multi-page routing |
| tailwindcss | ^3.4.7 | Utility CSS |
| framer-motion | ^8.1.6 | Animations |
| react-leaflet | ^4.4.0 | Interactive maps |
| react-hook-form | ^7.50.0 | Form validation |
| i18next | ^23.1.3 | Internationalization |
| zustand | ^4.5.7 | State management |
| react-helmet-async | ^1.3.0 | SEO meta tags |

### DevDependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React support
- `eslint` + `prettier` - Code quality
- `autoprefixer` - CSS vendor prefixes

---

## 🌐 Deployment

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel
```
Automatic deployments on git push.

### Option 2: Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
```bash
npm run build
# Create gh-pages branch
git branch gh-pages
git push origin dist:gh-pages
```

### Option 4: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🚨 Troubleshooting

### Port 5173 Already in Use
```bash
npm run dev -- --port 5174
```

### Modules Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Leaflet Map Not Showing
Ensure Leaflet CSS is imported:
```javascript
import 'leaflet/dist/leaflet.css'
```

### Dark Mode Not Persisting
Check browser localStorage is enabled and not full.

### Service Worker Issues
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or open DevTools → Application → Clear Site Data

---

## 📊 Performance Checklist

- [x] Lazy-load pages with React.lazy()
- [x] Code splitting with dynamic imports
- [x] Optimized build with Vite
- [x] Tailwind tree-shaking
- [x] Service worker caching
- [ ] Image optimization (add: WebP, srcset)
- [ ] Lighthouse audit (run: `npm run build`)
- [ ] CDN deployment

---

## 🔒 Security Best Practices

1. **Sanitize User Input**: Always validate form data
   ```javascript
   const onSubmit = (data) => {
     // Validate and sanitize
     console.log(data)
   }
   ```

2. **CORS**: Configure backend CORS headers properly

3. **Secrets**: Never commit `.env` files with API keys
   ```bash
   # .env (gitignore)
   VITE_API_URL=https://api.example.com
   ```

4. **CSP Headers**: Add to server/deployment config
   ```
   Content-Security-Policy: default-src 'self'
   ```

---

## 📱 Mobile Optimization

The project is mobile-first with Tailwind:
- Responsive grid: `grid md:grid-cols-3`
- Touch-friendly buttons: `p-4` (48x48px minimum)
- Viewport: Already set in `index.html`
- Tested on: iOS Safari, Chrome Mobile

Test locally:
```bash
npm run dev
# Open DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
```

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Tailwind**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion/
- **React Router**: https://reactrouter.com/
- **Zustand**: https://github.com/pmndrs/zustand

---

## 📞 Support

For issues or questions:
1. Check the README.md
2. Review src/ file examples
3. Check browser console for errors
4. Verify all dependencies installed: `npm list`

---

**Happy coding! 🎨**
