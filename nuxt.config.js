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
      title: 'Portfolio Archives // Operative Credentials Verified',
      meta: [
        {
          name: 'description',
          content:
            'Authenticated operator portfolio access. Core mission logs and codebase partitions are now online and ready for review.',
        },
        {
          property: 'og:title',
          content: 'Portfolio Archives // Operative Credentials Verified',
        },
        {
          property: 'og:description',
          content:
            'Authenticated operator portfolio access. Core mission logs and codebase partitions are now online and ready for review.',
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
