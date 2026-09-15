import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-09-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'Route: /maintenance // SECTOR OFFLINE',
      meta: [
        {
          name: 'description',
          content:
            'Cyberpunk terminal maintenance screen for RIG // NETRUNNER.SYS featuring live kernel diagnostics, CRT scanlines, audio telemetry, and emergency interactive reboot controls.',
        },
        {
          property: 'og:title',
          content: 'Route: /maintenance // SECTOR OFFLINE',
        },
        {
          property: 'og:description',
          content:
            'Cyberpunk terminal maintenance screen for RIG // NETRUNNER.SYS featuring live kernel diagnostics, CRT scanlines, audio telemetry, and emergency interactive reboot controls.',
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Space+Grotesk:wght@400;500;600;700&family=VT323&display=swap',
        },
      ],
    },
  },
});
