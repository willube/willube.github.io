# Auri – Entwickler & Musikproduzent Portfolio

Modernes, dunkles Portfolio für den jungen Entwickler und Musikproduzenten **Auri**. Die Seite ist als Single-Page-Application mit Vite, React und SCSS umgesetzt und deckt Hero-, Über-mich-, Projekt- und Kontaktsektionen ab.

## Highlights
- Glasartiges Dark-Theme mit Akzenten in Cyan (`#00E5FF`) und Lila (`#8E2DE2`).
- Sanfte Ladeanimation, Fade-in-Effekte beim Scrollen und dezente Parallax-Bewegung.
- Responsives Grid für Projekte (3–6 Karten) mit Hover-Effekten und Tech-Stacks.
- Minimalistisches Kontaktformular inklusive Social Links (Discord, GitHub, SoundCloud).
- SEO-Meta-Tags, Open-Graph-Vorschaubild, Smooth Scrolling und `prefers-reduced-motion`-Support.

## Projektstruktur
- `index.html` – Einstiegspunkt mit Meta-Tags, Google Fonts und Mount-Element.
- `vite.config.js` – Vite-Konfiguration für React.
- `src/App.jsx` – Hauptkomponente mit allen Sektionen.
- `src/styles/main.scss` – Globale Styles, Variablen, Animationen & Responsiveness.
- `src/data/projects.js` – Projektdaten samt Assets.
- `src/hooks/` – Custom-Hooks für Scroll-Reveal und Parallax.
- `src/assets/` – SVG-Mockups der Projekte.
- `public/favicon.svg` – Favicon im Neon-Stil.

## Schnellstart
```powershell
git clone https://github.com/willube/willube.github.io.git
cd willube.github.io
npm install
npm run dev
```

Danach ist die Seite standardmäßig unter <http://localhost:5173> erreichbar.

## Produktion bauen
```powershell
npm run build
npm run preview
```

`npm run build` erzeugt das optimierte Bundle in `dist/`. `npm run preview` dient zum Smoke-Test der Produktion.

## Anpassungen & Erweiterungen
- Passe die Texte in `App.jsx` an Auris echte Vita an.
- Ergänze eigene Projekt-Screenshots (`src/assets/`) oder binde externe Bilder ein.
- Verknüpfe das Formular mit einem Mail-/Form-Service deiner Wahl (z. B. Formspree, Netlify Forms).
- Ergänze Analytics, weitere Sektionen (Blog, Services) oder Internationalisierung.

---
© 2025 Auri Studio. Crafted with Heart & Future Nostalgia.
