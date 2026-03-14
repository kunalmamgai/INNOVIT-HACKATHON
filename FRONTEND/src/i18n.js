import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      siteTitle: 'AR-Chaelogist',
      home: 'Home',
      heritage: 'Heritage Sites',
      festivals: 'Festivals & Traditions',
      arts: 'Art & Crafts',
      languages: 'Languages & Literature',
      about: 'About',
      contact: 'Contact',
      explore: 'Explore'
    }
  },
  hi: {
    translation: {
      siteTitle: 'AR-Chaelogist',
      home: 'मुख पृष्ठ',
      heritage: 'धरोहर स्थल',
      festivals: 'त्योहार और परंपराएँ',
      arts: 'कला और शिल्प',
      languages: 'भाषाएँ और साहित्य',
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      explore: 'अन्वेषण'
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
