export default function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        // Check for updates periodically
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              // Optionally notify user of update
              console.log('New content available — refresh to update.');
            }
          });
        });
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn('Service worker registration failed', err);
      });
  });
}
