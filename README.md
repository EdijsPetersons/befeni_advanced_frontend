# Befeni frontend test

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequisites

You will need Node.js version 17.3 or greater installed on your system.

## Getting Started

Run the development server:

```bash
npm run dev
```

Run production build:

```bash
npm run build
# and
npm start
```

The app should now be up and running at http://localhost:3000

## Extending the theme

Project uses [tailwind CSS framework](https://tailwindcss.com/docs/theme) and the theme can be extened in `tailwind.config.js`.

Example:

```bash
module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      gray: {
        100: '#f7fafc',
        // ...
        900: '#1a202c',
      },

      // ...
    }
  }
}
```
