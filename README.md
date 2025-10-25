# Auri · Animated Bio Page

A modern, animation-rich biography page for Auri—a 16-year-old music producer & developer from Weimar—built with semantic HTML, expressive CSS, and lightweight JavaScript interactions.

## ✨ Highlights

- Fluid gradients, glassmorphism-inspired cards, and floating ambient blobs for a cinematic backdrop.
- Intersection Observer powered reveal animations that respect `prefers-reduced-motion` settings.
- Responsive navigation with a touch-friendly toggle and smooth section reveals.
- Modular structure with dedicated folders for styles and scripts.

## 📂 Project Structure

```
index.html
assets/
  css/
    style.css
  js/
    main.js
```

## 🚀 Getting Started

Open `index.html` in your preferred browser. No build step is required.

For local development with live reload, you can use any static server. Example (PowerShell):

```powershell
npx serve .
```

## 🛠 Customization Tips

- Update the biography copy, timeline entries, and project spotlights directly in `index.html`.
- Swap the portrait background image inside the `.portrait` class in `assets/css/style.css`.
- Adjust animation timings and delays via the CSS custom properties and `data-delay` attributes on elements with the `reveal` class.

## ♿ Accessibility & Motion

Animations pause and elements remain visible when visitors prefer reduced motion, honoring operating-system accessibility preferences.

---
Crafted with curiosity and ready for your personal touch.
