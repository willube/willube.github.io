# WorkSphere – Responsive Jobplattform UI

WorkSphere ist ein responsives HTML/CSS-Frontend für eine moderne Jobplattform, die Arbeitssuchende und Unternehmen miteinander vernetzt. Die Templates sind vollständig statisch und dienen als Grundlage für eine spätere Backend-Integration.

## Seitenüberblick
- `index.html` – Landing Page mit Hero, Feature-Highlights und Call-to-Actions für Talente & Firmen.
- `auth.html` – Login-/Registrierungsseite mit Formularen für Talente und Unternehmen.
- `candidate-dashboard.html` – Dashboard-Layout für Arbeitssuchende (Profil, Skills, Erfahrung, KI-Bewerbungen, Bewerbungsstatus).
- `employer-dashboard.html` – Dashboard-Layout für Unternehmen (Profilübersicht, Filter, Kandidatenlisten, Pipeline, Teamnotizen).
- `styles.css` – Gemeinsames, mobile-first Stylesheet mit Flex/Grid-Layouts, Komponenten und Media Queries.

## Features
- Mobile-first Design mit klaren Breakpoints für Tablets und Desktop.
- Sektionen & Komponenten (Hero, Karten, Tabellen, Filter, Toggles) lassen sich direkt mit Backend-Daten füllen.
- Freundliche, vertrauenswürdige Farbpalette (Blau/Weiß mit Akzent Orange).
- Eingebundene Icons via Font Awesome und Systemschrift „Inter“ für moderne Typografie.
- Kommentierte Markup-Bereiche für zukünftige API- oder Formular-Endpunkte.

## Verwendung
1. Projekt klonen oder Dateien lokal speichern.
2. Öffne eine der HTML-Dateien direkt im Browser (z. B. per Doppelklick auf `index.html`).
3. Navigiere über die Links im Header zwischen den Seiten.

> Optional: Für eine lokale Entwicklung mit Live-Reload kann ein beliebiger Static-Server genutzt werden (z. B. `npx serve` oder die Live-Server-Erweiterung in VS Code).

## Weiterentwicklung
- Ersetze Platzhaltertexte durch echte API-Daten.
- Verbinde die Formulare (`auth.html`) mit deinen Auth-Endpunkten.
- Ergänze JavaScript-Logik für dynamische Filter, Dashboard-Widgets oder Websocket-Updates.
- Integriere ein Build-Setup (z. B. Vite) falls Komponenten modularisiert werden sollen.

---
© 2025 WorkSphere Prototype. Alle Rechte vorbehalten.
